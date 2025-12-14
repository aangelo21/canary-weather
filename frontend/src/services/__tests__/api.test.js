/* eslint-disable no-undef */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('API Service', () => {
  let apiService;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubGlobal('fetch', vi.fn());
    
    // Dynamically import the module
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

  it('should make requests with correct base URL', async () => {
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });

    await apiService.apiFetch('/test');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:85/api/test',
      expect.objectContaining({
        credentials: 'include',
        headers: expect.not.objectContaining({ Authorization: expect.any(String) }),
      })
    );
  });

  it('should include Authorization header when token is set', async () => {
    apiService.setAccessToken('valid-token');
    global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });

    await apiService.apiFetch('/protected');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:85/api/protected',
      expect.objectContaining({
        credentials: 'include',
        headers: expect.objectContaining({
          Authorization: 'Bearer valid-token',
        }),
      })
    );
  });

  it('should handle 401 and attempt refresh', async () => {
    // First call fails with 401
    global.fetch.mockResolvedValueOnce({ status: 401, ok: false });
    // Refresh call succeeds
    global.fetch.mockResolvedValueOnce({ 
      ok: true, 
      json: async () => ({ accessToken: 'new-token' }) 
    });
    // Retry original call succeeds
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });
  });
});
