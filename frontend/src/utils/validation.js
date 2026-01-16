/**
 * Validation utility functions for form inputs
 */

/**
 * Validates password strength
 * Requirements: 6-20 characters, at least one uppercase, one lowercase, one number, and one symbol
 * @param {string} password - The password to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
    const errors = [];

    if (!password) {
        errors.push('Password is required');
        return { isValid: false, errors };
    }

    if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }

    if (password.length > 20) {
        errors.push('Password must not exceed 20 characters');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validates email format
 * @param {string} email - The email to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
    if (!email) {
        return { isValid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true, error: '' };
};

/**
 * Validates username
 * @param {string} username - The username to validate
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateUsername = (username) => {
    if (!username) {
        return { isValid: false, error: 'Username is required' };
    }

    if (username.length < 3) {
        return { isValid: false, error: 'Username must be at least 3 characters long' };
    }

    if (username.length > 20) {
        return { isValid: false, error: 'Username must not exceed 20 characters' };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return { isValid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
    }

    return { isValid: true, error: '' };
};

/**
 * Validates that two passwords match
 * @param {string} password - The password
 * @param {string} confirmPassword - The confirmation password
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
    if (!confirmPassword) {
        return { isValid: false, error: 'Please confirm your password' };
    }

    if (password !== confirmPassword) {
        return { isValid: false, error: 'Passwords do not match' };
    }

    return { isValid: true, error: '' };
};

/**
 * Validates required field
 * @param {string} value - The value to validate
 * @param {string} fieldName - The name of the field
 * @returns {Object} - { isValid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    return { isValid: true, error: '' };
};

/**
 * Get password strength level for visual feedback
 * @param {string} password - The password to check
 * @returns {Object} - { strength: string, color: string, percentage: number }
 */
export const getPasswordStrength = (password) => {
    if (!password) {
        return { strength: 'none', color: 'gray', percentage: 0 };
    }

    let score = 0;

    // Length score
    if (password.length >= 6) score += 20;
    if (password.length >= 10) score += 10;
    if (password.length >= 15) score += 10;

    // Character variety
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 15;

    if (score <= 30) {
        return { strength: 'weak', color: 'red', percentage: score };
    } else if (score <= 60) {
        return { strength: 'medium', color: 'yellow', percentage: score };
    } else {
        return { strength: 'strong', color: 'green', percentage: score };
    }
};
