import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import './mock.test.jsx';

describe('API Service', () => {
    let apiService;

    beforeEach(async () => {
        vi.clearAllMocks();
        vi.stubGlobal('fetch', vi.fn());
        vi.stubGlobal('import.meta', {
            env: {
                VITE_API_BASE: 'http://localhost:3000',
            },
        });

        const module = await import('../src/services/api.js');
        apiService = module;
        apiService.setAccessToken(null);
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should manage access token correctly', () => {
        expect(apiService.getAccessToken()).toBeNull();
        apiService.setAccessToken('test-token');
        expect(apiService.getAccessToken()).toBe('test-token');
    });

    it('should handle token refresh on 401', async () => {
        const mockEndpoint = '/test';
        
        global.fetch
            .mockResolvedValueOnce({ status: 401, ok: false })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ token: 'new-token' }),
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ success: true }),
            });

        await apiService.apiFetch(mockEndpoint);
        
        expect(global.fetch).toHaveBeenCalled();
    });
});
