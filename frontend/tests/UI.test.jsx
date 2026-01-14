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

describe('UI Components', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('fetch', vi.fn());
        vi.stubGlobal('import.meta', { env: { VITE_OPENWEATHER_API_KEY: 'test-key', VITE_API_BASE: 'http://localhost:3000', VITE_VAPID_PUBLIC_KEY: 'test-vapid' } });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should render HourlyForecast with data and handle errors', async () => {
        const mockCoords = { lat: 28.0, lon: -15.0 };
        const mockData = { list: Array(10).fill(null).map((_, i) => ({ dt: 1700000000 + i * 3600 * 3, main: { temp: 20 + i }, weather: [{ icon: '01d', main: 'Clear' }], sys: { pod: 'd' }, pop: 0.1, wind: { speed: 5 + i } })) };
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => mockData });
        const { rerender } = render(<HourlyForecast coords={mockCoords} />);
        await waitFor(() => expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument());
        expect(screen.getByText('20°')).toBeInTheDocument();
        expect(screen.getByText('5 km/h')).toBeInTheDocument();
        
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        global.fetch.mockRejectedValueOnce(new Error('Network error'));
        rerender(<HourlyForecast coords={{ lat: 29, lon: -16 }} />);
        await waitFor(() => expect(screen.getByText('Could not load forecast.')).toBeInTheDocument());
        consoleSpy.mockRestore();
    });

    it('should handle NotificationToggle subscription flow', async () => {
        const user = userEvent.setup();
        const mockPushManager = { getSubscription: vi.fn(), subscribe: vi.fn() };
        const mockServiceWorker = { getRegistration: vi.fn(), register: vi.fn() };
        
        global.navigator.serviceWorker = mockServiceWorker;
        global.window.PushManager = {};
        apiService.getAccessToken.mockReturnValue('mock-token');
        mockServiceWorker.getRegistration.mockResolvedValue({ pushManager: mockPushManager });
        mockPushManager.getSubscription.mockResolvedValue(null);
        
        render(<NotificationToggle />);
        await waitFor(() => expect(screen.getByText('enableNotifications')).toBeInTheDocument());
        
        mockPushManager.getSubscription.mockResolvedValue({ endpoint: 'https://fcm.googleapis.com/fcm/send/...' });
        global.fetch.mockResolvedValue({ ok: true, json: async () => ({ exists: true }) });
        const { rerender } = render(<NotificationToggle />);
        await waitFor(() => expect(screen.getByText('disableNotifications')).toBeInTheDocument());
        
        mockPushManager.getSubscription.mockResolvedValue(null);
        mockPushManager.subscribe.mockResolvedValue({ endpoint: 'new-endpoint', toJSON: () => ({ endpoint: 'new-endpoint' }) });
        global.fetch.mockImplementation((url) => {
            if (url?.includes('/push/vapid-public-key')) return Promise.resolve({ ok: true, json: async () => ({ publicKey: 'dGVzdA==' }) });
            if (url?.includes('/push/subscribe')) return Promise.resolve({ ok: true, json: async () => ({}) });
            return Promise.resolve({ ok: true, json: async () => ({ exists: false }) });
        });
        
        rerender(<NotificationToggle />);
        await waitFor(() => expect(screen.getByText('enableNotifications')).toBeInTheDocument());
        await user.click(screen.getByText('enableNotifications'));
        await waitFor(() => {
            expect(mockPushManager.subscribe).toHaveBeenCalled();
            expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/push/subscribe'), expect.objectContaining({ method: 'POST' }));
        });
    });

    it('should render and interact with LoginModal', async () => {
        const user = userEvent.setup();
        const mockOnClose = vi.fn();
        const mockOnLogin = vi.fn();
        const mockOnLogout = vi.fn();
        
        userService.fetchMunicipalities.mockResolvedValue([]);
        vi.stubGlobal('localStorage', { getItem: vi.fn(), setItem: vi.fn(), removeItem: vi.fn(), clear: vi.fn() });
        
        const { rerender, unmount } = render(<LoginModal isOpen={true} onClose={mockOnClose} onLogin={mockOnLogin} onLogout={mockOnLogout} initialMode="login" />);
        expect(screen.getByLabelText('emailOrUsername')).toBeInTheDocument();
        expect(screen.getByLabelText('password')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'signIn' })).toBeInTheDocument();
        
        await user.click(screen.getByText('signUp'));
        expect(screen.getByLabelText('email')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'signUp' })).toBeInTheDocument();
        
        unmount();
        render(<LoginModal isOpen={true} onClose={mockOnClose} onLogin={mockOnLogin} onLogout={mockOnLogout} initialMode="login" />);
        const mockUser = { id: 1, username: 'testuser' };
        userService.loginUser.mockResolvedValue({ user: mockUser });
        
        await user.type(screen.getByLabelText('emailOrUsername'), 'testuser');
        await user.type(screen.getByLabelText('password'), 'password123');
        await user.click(screen.getByRole('button', { name: 'signIn' }));
        
        await waitFor(() => {
            expect(userService.loginUser).toHaveBeenCalledWith({ username: 'testuser', password: 'password123' });
            expect(mockOnLogin).toHaveBeenCalledWith(mockUser);
        }, { timeout: 3000 });
        
        userService.loginUser.mockRejectedValue(new Error('Invalid credentials'));
        await user.type(screen.getByLabelText('emailOrUsername'), 'wrong');
        await user.type(screen.getByLabelText('password'), 'wrong');
        await user.click(screen.getByRole('button', { name: 'signIn' }));
        await waitFor(() => expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument(), { timeout: 3000 });
    });
});
