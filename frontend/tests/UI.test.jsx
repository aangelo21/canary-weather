import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import './mock.test.jsx';

vi.mock('../src/services/api', () => ({
    getAccessToken: vi.fn(),
    setAccessToken: vi.fn(),
    apiFetch: vi.fn(),
}));

vi.mock('../src/services/userService', () => ({
    loginUser: vi.fn(),
    createOrUpdateUser: vi.fn(),
    deleteUser: vi.fn(),
    fetchMunicipalities: vi.fn(),
    getCurrentUser: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
    Link: ({ children, to }) => React.createElement('a', { href: to }, children),
}));

import HourlyForecast from '../src/components/home/HourlyForecast';
import NotificationToggle from '../src/components/NotificationToggle';
import LoginModal from '../src/components/common/LoginModal';
import * as apiService from '../src/services/api';
import * as userService from '../src/services/userService';

describe('HourlyForecast', () => {
    const mockCoords = { lat: 28.0, lon: -15.0 };

    const mockForecastData = {
        list: Array(10)
            .fill(null)
            .map((_, index) => ({
                dt: 1700000000 + index * 3600 * 3,
                main: { temp: 20 + index },
                weather: [{ icon: '01d', main: 'Clear' }],
                sys: { pod: 'd' },
                pop: 0.1,
                wind: { speed: 5 + index },
            })),
    };

    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
        vi.stubGlobal('import.meta', {
            env: {
                VITE_OPENWEATHER_API_KEY: 'test-api-key',
            },
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should render forecast data successfully', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => mockForecastData,
        });

        render(<HourlyForecast coords={mockCoords} />);

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        expect(screen.getByText('20°')).toBeInTheDocument();
        expect(screen.getByText('5 km/h')).toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
        const consoleSpy = vi
            .spyOn(console, 'error')
            .mockImplementation(() => {});
        global.fetch.mockRejectedValue(new Error('Network error'));

        render(<HourlyForecast coords={mockCoords} />);

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });

        expect(
            screen.getByText('Could not load forecast.'),
        ).toBeInTheDocument();
        consoleSpy.mockRestore();
    });
});

describe('NotificationToggle', () => {
    const mockServiceWorker = {
        getRegistration: vi.fn(),
        register: vi.fn(),
    };

    const mockPushManager = {
        getSubscription: vi.fn(),
        subscribe: vi.fn(),
    };

    beforeEach(() => {
        global.navigator.serviceWorker = mockServiceWorker;
        global.window.PushManager = {};
        global.fetch = vi.fn();

        apiService.getAccessToken.mockReturnValue('mock-token');
        mockServiceWorker.getRegistration.mockResolvedValue({
            pushManager: mockPushManager,
        });
        mockPushManager.getSubscription.mockResolvedValue(null);

        vi.stubGlobal('import.meta', {
            env: {
                VITE_API_BASE: 'http://localhost:3000',
                VITE_VAPID_PUBLIC_KEY: 'test-vapid-key',
            },
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.unstubAllGlobals();
    });

    it('should show "Enable Notifications" when not subscribed', async () => {
        mockServiceWorker.getRegistration.mockResolvedValue(null);

        render(<NotificationToggle />);

        await waitFor(() => {
            expect(screen.getByText('enableNotifications')).toBeInTheDocument();
        });
    });

    it('should show "Disable Notifications" when subscribed', async () => {
        const mockSubscription = {
            endpoint: 'https://fcm.googleapis.com/fcm/send/...',
        };
        mockPushManager.getSubscription.mockResolvedValue(mockSubscription);

        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ exists: true }),
        });

        render(<NotificationToggle />);

        await waitFor(() => {
            expect(
                screen.getByText('disableNotifications'),
            ).toBeInTheDocument();
        });
    });

    it('should handle subscription process', async () => {
        const user = userEvent.setup();
        mockServiceWorker.getRegistration.mockResolvedValue({
            pushManager: mockPushManager,
        });
        mockPushManager.getSubscription.mockResolvedValue(null);
        mockPushManager.subscribe.mockResolvedValue({
            endpoint: 'new-endpoint',
            toJSON: () => ({ endpoint: 'new-endpoint' }),
        });

        global.fetch.mockImplementation((url) => {
            if (url && url.includes('/push/vapid-public-key')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({ publicKey: 'dGVzdA==' }),
                });
            }
            if (url && url.includes('/push/subscribe')) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({}),
                });
            }

            return Promise.resolve({
                ok: true,
                json: async () => ({ exists: false }),
            });
        });

        render(<NotificationToggle />);

        await waitFor(() => {
            expect(screen.getByText('enableNotifications')).toBeInTheDocument();
        });

        const button = screen.getByText('enableNotifications');
        await user.click(button);

        await waitFor(() => {
            expect(mockPushManager.subscribe).toHaveBeenCalled();
            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/push/subscribe'),
                expect.objectContaining({ method: 'POST' }),
            );
            expect(
                screen.getByText('disableNotifications'),
            ).toBeInTheDocument();
        });
    });
});

describe('LoginModal', () => {
    const mockOnClose = vi.fn();
    const mockOnLogin = vi.fn();
    const mockOnLogout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        userService.fetchMunicipalities.mockResolvedValue([]);
        
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should render login form by default', () => {
        render(
            <LoginModal
                isOpen={true}
                onClose={mockOnClose}
                onLogin={mockOnLogin}
                onLogout={mockOnLogout}
            />,
        );

        expect(screen.getByLabelText('emailOrUsername')).toBeInTheDocument();
        expect(screen.getByLabelText('password')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'signIn' }),
        ).toBeInTheDocument();
    });

    it('should switch to signup form', async () => {
        const user = userEvent.setup();
        render(
            <LoginModal
                isOpen={true}
                onClose={mockOnClose}
                onLogin={mockOnLogin}
                onLogout={mockOnLogout}
            />,
        );

        const switchButton = screen.getByText('signUp');
        await user.click(switchButton);

        expect(screen.getByLabelText('email')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'signUp' }),
        ).toBeInTheDocument();
    });

    it('should handle successful login', async () => {
        const user = userEvent.setup();
        const mockUser = { id: 1, username: 'testuser' };
        userService.loginUser.mockResolvedValue({ user: mockUser });

        render(
            <LoginModal
                isOpen={true}
                onClose={mockOnClose}
                onLogin={mockOnLogin}
                onLogout={mockOnLogout}
            />,
        );

        await user.type(screen.getByLabelText('emailOrUsername'), 'testuser');
        await user.type(screen.getByLabelText('password'), 'password123');
        await user.click(screen.getByRole('button', { name: 'signIn' }));

        await waitFor(() => {
            expect(userService.loginUser).toHaveBeenCalledWith({
                username: 'testuser',
                password: 'password123',
            });
            expect(mockOnLogin).toHaveBeenCalledWith(mockUser);
        });
    });
});
