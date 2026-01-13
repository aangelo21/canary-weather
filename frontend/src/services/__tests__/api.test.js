
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('API Service', () => {
    let apiService;

    beforeEach(async () => {
        vi.resetModules();
        vi.stubGlobal('fetch', vi.fn());

        
        apiService = await import('../api');
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

    it('should handle 401 and attempt refresh', async () => {
        
        global.fetch.mockResolvedValueOnce({ status: 401, ok: false });
        
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ accessToken: 'new-token' }),
        });
        
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });
    });
});
