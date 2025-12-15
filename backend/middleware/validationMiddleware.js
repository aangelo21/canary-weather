/**
 * Validation middleware for user input
 */

/**
 * Validates password strength
 * Requirements: 6-20 characters, at least one uppercase, one lowercase, one number, and one symbol
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
        errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

/**
 * Validates email format
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
 * Middleware to validate user registration data
 */
export const validateRegistration = (req, res, next) => {
    const { email, username, password } = req.body;

    const errors = [];

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
        errors.push(emailValidation.error);
    }

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
        errors.push(usernameValidation.error);
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
        errors.push(...passwordValidation.errors);
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }

    next();
};

/**
 * Middleware to validate password reset data
 */
export const validatePasswordReset = (req, res, next) => {
    const { newPassword } = req.body;

    const passwordValidation = validatePassword(newPassword);

    if (!passwordValidation.isValid) {
        return res.status(400).json({
            error: 'Password validation failed',
            details: passwordValidation.errors
        });
    }

    next();
};

/**
 * Middleware to validate user update data
 */
export const validateUserUpdate = (req, res, next) => {
    const { password } = req.body;
    const errors = [];

    // Only validate password if it's being updated
    if (password) {
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            errors.push(...passwordValidation.errors);
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }

    next();
};

/**
 * Middleware to validate contact form data
 */
export const validateContactForm = (req, res, next) => {
    const { name, subject, message, email } = req.body;
    const errors = [];

    if (!name || name.trim().length === 0) {
        errors.push('Name is required');
    }

    if (!subject || subject.trim().length === 0) {
        errors.push('Subject is required');
    }

    if (!message || message.trim().length === 0) {
        errors.push('Message is required');
    }

    if (message && message.length > 5000) {
        errors.push('Message must not exceed 5000 characters');
    }

    // Validate email if provided (for non-authenticated users)
    if (email) {
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            errors.push(emailValidation.error);
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }

    next();
};
