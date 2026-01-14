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

    it('should include auth header when token exists', async () => {
        apiService.setAccessToken('my-token');
        global.fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
        
        await apiService.apiFetch('/endpoint');
        
        expect(global.fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: 'Bearer my-token'
                })
            })
        );
    });

    it('should handle non-401 errors gracefully', async () => {
        global.fetch.mockResolvedValue({ status: 500, ok: false });
        const response = await apiService.apiFetch('/endpoint');
        expect(response.ok).toBe(false);
    });
});

describe('Validation Utils', () => {
    describe('validatePassword', () => {
        it('should validate valid password', () => {
            const result = validatePassword('Pass123!');
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should fail if password is empty', () => {
            const result = validatePassword('');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Password is required');
        });

        it('should fail if too short', () => {
            const result = validatePassword('Pas1!');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Password must be at least 6 characters long');
        });

        it('should fail if too long', () => {
            const result = validatePassword('A'.repeat(21) + '1!a');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Password must not exceed 20 characters');
        });

        it('should fail if no uppercase', () => {
            const result = validatePassword('pass123!');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Password must contain at least one uppercase letter');
        });

        it('should fail if no lowercase', () => {
            const result = validatePassword('PASS123!');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Password must contain at least one lowercase letter');
        });

        it('should fail if no number', () => {
            const result = validatePassword('PassWord!');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Password must contain at least one number');
        });

        it('should fail if no special char', () => {
            const result = validatePassword('Pass1234');
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Password must contain at least one special character');
        });
    });

    describe('validateEmail', () => {
        it('should validate correct email', () => {
            expect(validateEmail('test@example.com').isValid).toBe(true);
        });

        it('should fail empty email', () => {
            const result = validateEmail('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Email is required');
        });

        it('should fail invalid format', () => {
            const result = validateEmail('test@');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Please enter a valid email address');
        });
    });

    describe('validateUsername', () => {
        it('should validate correct username', () => {
            expect(validateUsername('user_123').isValid).toBe(true);
        });

        it('should fail empty username', () => {
            const result = validateUsername('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username is required');
        });

        it('should fail short username', () => {
            const result = validateUsername('us');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username must be at least 3 characters long');
        });

        it('should fail long username', () => {
            const result = validateUsername('a'.repeat(21));
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username must not exceed 20 characters');
        });

        it('should fail invalid chars', () => {
            const result = validateUsername('user@name');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username can only contain letters, numbers, hyphens, and underscores');
        });
    });

    describe('validatePasswordMatch', () => {
        it('should validate matching passwords', () => {
            expect(validatePasswordMatch('pass', 'pass').isValid).toBe(true);
        });

        it('should fail empty confirmation', () => {
            const result = validatePasswordMatch('pass', '');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Please confirm your password');
        });

        it('should fail mismatch', () => {
            const result = validatePasswordMatch('pass1', 'pass2');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Passwords do not match');
        });
    });

    describe('validateRequired', () => {
        it('should validate non-empty string', () => {
            expect(validateRequired('hello').isValid).toBe(true);
        });

        it('should fail on empty string', () => {
            const result = validateRequired('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('This field is required');
        });

        it('should fail on null', () => {
            const result = validateRequired(null);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('This field is required');
        });

        it('should use custom field name', () => {
            const result = validateRequired('', 'Username');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Username is required');
        });
    });

    describe('getPasswordStrength', () => {
        it('should return none for empty', () => {
            const result = getPasswordStrength('');
            expect(result).toEqual({ strength: 'none', color: 'gray', percentage: 0 });
        });

        it('should return weak for simple passwords', () => {
            const result = getPasswordStrength('abc');
            expect(result.strength).toBe('weak');
        });

        it('should return medium for decent passwords', () => {
            const result = getPasswordStrength('password123');
            expect(result.strength).toBe('medium');
        });

        it('should return strong for complex passwords', () => {
            const result = getPasswordStrength('Password123!');
            expect(result.strength).toBe('strong');
        });
    });
});

describe('User Service', () => {
    let userService;

    beforeEach(async () => {
        vi.resetModules();
        vi.stubGlobal('fetch', vi.fn());
        vi.stubGlobal('import.meta', { env: { VITE_API_BASE: 'http://localhost:3000' } });
        userService = await import('../src/services/userService');
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should login user successfully', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ token: 'fake-token', user: { id: 1 } }),
            headers: { get: () => 'application/json' }
        });

        const result = await userService.loginUser({ username: 'user', password: 'pw' });
        expect(result.token).toBe('fake-token');
    });

    it('should handle login error', async () => {
        global.fetch.mockResolvedValue({
            ok: false,
            headers: { get: () => 'application/json' },
            json: async () => ({ error: 'Invalid credentials' })
        });

        await expect(userService.loginUser({ username: 'u', password: 'p' }))
            .rejects.toThrow('Invalid credentials');
    });
    
    it('should fetch current user', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ id: 1, username: 'me' })
        });
        
        const user = await userService.getCurrentUser();
        expect(user.id).toBe(1);
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/users/me'),
            expect.anything()
        );
    });

    it('should handle logout', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ success: true })
        });
        
        await userService.logoutUser();
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/users/logout'),
            expect.objectContaining({ method: 'POST' })
        );
    });

    it('should restore session successfully', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ token: 'refreshed-token' })
        });
        
        const result = await userService.restoreSession();
        expect(result).toBe(true);
    });

    it('should handle restore session failure', async () => {
        global.fetch.mockResolvedValue({ ok: false });
        const result = await userService.restoreSession();
        expect(result).toBe(false);
    });
});

describe('Location Service', () => {
    let locationService;

    beforeEach(async () => {
        vi.resetModules();
        vi.stubGlobal('fetch', vi.fn());
        vi.stubGlobal('import.meta', { env: { VITE_API_BASE: 'http://localhost:3000' } });
        locationService = await import('../src/services/locationService');
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should fetch locations', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ([{ id: 1, name: 'Loc' }])
        });

        const locs = await locationService.fetchLocations();
        expect(locs).toHaveLength(1);
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/locations'),
            expect.anything()
        );
    });

    it('should fetch location by id', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ id: 5, name: 'Test Location' })
        });

        const loc = await locationService.fetchLocationById(5);
        expect(loc.id).toBe(5);
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/locations/5'),
            expect.anything()
        );
    });

    it('should handle fetch error', async () => {
        global.fetch.mockResolvedValue({ ok: false });
        await expect(locationService.fetchLocations()).rejects.toThrow();
    });
});

describe('POI Service', () => {
    let poiService;

    beforeEach(async () => {
        vi.resetModules();
        vi.stubGlobal('fetch', vi.fn());
        vi.stubGlobal('import.meta', { env: { VITE_API_BASE: 'http://localhost:3000' } });
        poiService = await import('../src/services/poiService');
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('should fetch POIs', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ([{ id: 1, name: 'POI' }])
        });

        const pois = await poiService.fetchPois();
        expect(pois).toHaveLength(1);
    });

    it('should handle POI fetch error', async () => {
        global.fetch.mockResolvedValue({ ok: false });
        await expect(poiService.fetchPois()).rejects.toThrow('Error fetching POIs');
    });
});

describe('AI Service', () => {
    let aiService;

    beforeEach(async () => {
        vi.resetModules();
        vi.stubGlobal('fetch', vi.fn());
        vi.stubGlobal('import.meta', { env: { VITE_API_BASE: 'http://localhost:3000' } });
        aiService = await import('../src/services/aiService');
    });

    it('should ask AI', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ text: 'AI response' })
        });

        const res = await aiService.askAI('hello');
        expect(res).toBe('AI response');
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/ai/chat'),
            expect.objectContaining({ method: 'POST' })
        );
    });

    it('should handle AI error and return fallback message', async () => {
        global.fetch.mockResolvedValue({ ok: false, status: 500, json: async () => ({}) });
        const res = await aiService.askAI('test');
        expect(res).toContain('cannot connect');
    });

    it('should return spanish fallback on error when lang is es', async () => {
        global.fetch.mockRejectedValue(new Error('Network error'));
        const res = await aiService.askAI('test', {}, 'es');
        expect(res).toContain('Lo siento');
    });
});

describe('Alert Service', () => {
    let alertService;

    beforeEach(async () => {
        vi.resetModules();
        vi.stubGlobal('fetch', vi.fn());
        vi.stubGlobal('import.meta', { env: { VITE_API_BASE: 'http://localhost:3000' } });
        alertService = await import('../src/services/alertService');
    });
    
    it('should fetch alerts', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ([{ id: 1, type: 'Warning' }])
        });

        const alerts = await alertService.fetchAlerts();
        expect(alerts).toHaveLength(1);
    });

    it('should fetch alerts by location', async () => {
        global.fetch.mockResolvedValue({
            ok: true,
            json: async () => ([{ id: 2, type: 'Storm', location_id: 10 }])
        });

        const alerts = await alertService.fetchAlertsByLocation(10);
        expect(alerts).toHaveLength(1);
        expect(alerts[0].location_id).toBe(10);
    });

    it('should handle alerts fetch error', async () => {
        global.fetch.mockResolvedValue({ ok: false });
        await expect(alertService.fetchAlerts()).rejects.toThrow();
    });
});

