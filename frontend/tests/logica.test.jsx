import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    validatePassword,
    validateEmail,
    validateUsername,
    validatePasswordMatch,
    getPasswordStrength,
    validateRequired
} from '../src/utils/validation';
import './mock.test.jsx';

describe('Validation & Services', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('fetch', vi.fn());
        vi.stubGlobal('import.meta', { env: { VITE_API_BASE: 'http://localhost:3000' } });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should validate all input types comprehensively', () => {
        expect(validatePassword('Pass123!').isValid).toBe(true);
        expect(validatePassword('').errors).toContain('Password is required');
        expect(validatePassword('short').errors.length).toBeGreaterThan(0);
        expect(validatePassword('A'.repeat(21) + '1!a').errors).toContain('Password must not exceed 20 characters');
        
        expect(validateEmail('test@example.com').isValid).toBe(true);
        expect(validateEmail('').error).toBe('Email is required');
        expect(validateEmail('invalid').error).toBe('Please enter a valid email address');
        
        expect(validateUsername('user_123').isValid).toBe(true);
        expect(validateUsername('').error).toBe('Username is required');
        expect(validateUsername('us').error).toContain('at least 3 characters');
        expect(validateUsername('user@name').error).toContain('only contain letters');
        
        expect(validatePasswordMatch('pass', 'pass').isValid).toBe(true);
        expect(validatePasswordMatch('pass1', 'pass2').error).toBe('Passwords do not match');
        
        expect(validateRequired('hello').isValid).toBe(true);
        expect(validateRequired('', 'Field').error).toBe('Field is required');
        
        expect(getPasswordStrength('').strength).toBe('none');
        expect(getPasswordStrength('abc').strength).toBe('weak');
        expect(getPasswordStrength('password123').strength).toBe('medium');
        expect(getPasswordStrength('Password123!').strength).toBe('strong');
    });

    it('should handle API service operations', async () => {
        const apiService = await import('../src/services/api.js');
        apiService.setAccessToken(null);
        
        expect(apiService.getAccessToken()).toBeNull();
        apiService.setAccessToken('test-token');
        expect(apiService.getAccessToken()).toBe('test-token');
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({}) });
        await apiService.apiFetch('/endpoint');
        expect(global.fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({ Authorization: 'Bearer test-token' })
            })
        );
        
        global.fetch.mockResolvedValueOnce({ status: 401, ok: false })
            .mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'new-token' }) })
            .mockResolvedValueOnce({ ok: true, json: async () => ({}) });
        
        await apiService.apiFetch('/test');
        expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle user service operations', async () => {
        const userService = await import('../src/services/userService');
        
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ token: 'token', user: { id: 1 } }),
            headers: { get: () => 'application/json' }
        });
        const loginResult = await userService.loginUser({ username: 'u', password: 'p' });
        expect(loginResult.token).toBe('token');
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });
        await userService.logoutUser();
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'refresh' }) });
        expect(await userService.restoreSession()).toBe(true);
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1 }) });
        const user = await userService.getCurrentUser();
        expect(user.id).toBe(1);
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 1 }]) });
        const users = await userService.fetchUsers();
        expect(users).toHaveLength(1);
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 2 }) });
        await userService.createOrUpdateUser({ username: 'new' });
        
        global.fetch.mockResolvedValueOnce({ ok: true, status: 204 });
        const delResult = await userService.deleteUser(1);
        expect(delResult.success).toBe(true);
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ([{ name: 'City' }]) });
        const munis = await userService.fetchMunicipalities();
        expect(munis[0].name).toBe('City');
    });

    it('should handle location service operations', async () => {
        const locationService = await import('../src/services/locationService');
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 1 }]) });
        const locs = await locationService.fetchLocations();
        expect(locs).toHaveLength(1);
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 5 }) });
        const loc = await locationService.fetchLocationById(5);
        expect(loc.id).toBe(5);
        
        global.fetch.mockResolvedValueOnce({ ok: false });
        await expect(locationService.fetchLocations()).rejects.toThrow();
    });

    it('should handle POI service operations', async () => {
        const poiService = await import('../src/services/poiService');
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 1 }]) });
        const pois = await poiService.fetchPois();
        expect(pois).toHaveLength(1);
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 2, is_global: false }]) });
        const personal = await poiService.fetchPersonalPois();
        expect(personal[0].is_global).toBe(false);
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 3 }) });
        await poiService.createOrUpdatePoi({ name: 'Test', latitude: '28', longitude: '-15', is_global: true });
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ success: true }) });
        const delResult = await poiService.deletePoi(1);
        expect(delResult.success).toBe(true);
    });

    it('should handle AI service operations', async () => {
        const aiService = await import('../src/services/aiService');
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ text: 'AI response' }) });
        const res = await aiService.askAI('hello');
        expect(res).toBe('AI response');
        
        global.fetch.mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) });
        const fallback = await aiService.askAI('test');
        expect(fallback).toContain('cannot connect');
        
        global.fetch.mockRejectedValueOnce(new Error('Network'));
        const esFallback = await aiService.askAI('test', {}, 'es');
        expect(esFallback).toContain('Lo siento');
    });

    it('should handle alert service operations', async () => {
        const alertService = await import('../src/services/alertService');
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 1 }]) });
        const alerts = await alertService.fetchAlerts();
        expect(alerts).toHaveLength(1);
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ([{ id: 2, location_id: 10 }]) });
        const byLoc = await alertService.fetchAlertsByLocation(10);
        expect(byLoc[0].location_id).toBe(10);
        
        global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ warnings: [] }) });
        await alertService.fetchWarnings();
        
        global.fetch.mockResolvedValueOnce({ ok: false });
        await expect(alertService.fetchAlerts()).rejects.toThrow();
    });
});

