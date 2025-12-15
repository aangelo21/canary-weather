
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import NotificationToggle from '../NotificationToggle';
import * as apiService from '../../services/api';


vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));

vi.mock('../../services/api', () => ({
    getAccessToken: vi.fn(),
}));

vi.mock('../common/Skeleton', () => ({
    default: () => <div data-testid="skeleton">Loading...</div>,
}));

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

    it('should render skeleton while checking subscription', async () => {
        
        mockServiceWorker.getRegistration.mockImplementation(
            () =>
                new Promise((resolve) => setTimeout(() => resolve(null), 100)),
        );

        render(<NotificationToggle />);

        expect(screen.getAllByTestId('skeleton')[0]).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
        });
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
