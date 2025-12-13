import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import NotificationToggle from '../NotificationToggle';
import * as apiService from '../../services/api';

// Mock dependencies
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
    // Mock global objects
    global.navigator.serviceWorker = mockServiceWorker;
    global.window.PushManager = {};
    global.fetch = vi.fn();
    
    // Default mocks
    apiService.getAccessToken.mockReturnValue('mock-token');
    mockServiceWorker.getRegistration.mockResolvedValue({
      pushManager: mockPushManager,
    });
    mockPushManager.getSubscription.mockResolvedValue(null);
    
    // Mock environment variable
    vi.stubGlobal('import.meta', { 
      env: { 
        VITE_API_BASE: 'http://localhost:3000',
        VITE_VAPID_PUBLIC_KEY: 'test-vapid-key'
      } 
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('should render skeleton while checking subscription', async () => {
    // Delay the check to allow checking state to be true initially
    mockServiceWorker.getRegistration.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(null), 100)));
    
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
    const mockSubscription = { endpoint: 'https://fcm.googleapis.com/fcm/send/...' };
    mockPushManager.getSubscription.mockResolvedValue(mockSubscription);
    
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ exists: true }),
    });

    render(<NotificationToggle />);

    await waitFor(() => {
      expect(screen.getByText('disableNotifications')).toBeInTheDocument();
    });
  });

  it('should handle subscription process', async () => {
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
      // Default for check-subscription or others
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
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockPushManager.subscribe).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/push/subscribe'),
        expect.objectContaining({ method: 'POST' })
      );
      expect(screen.getByText('disableNotifications')).toBeInTheDocument();
    });
  });
});
