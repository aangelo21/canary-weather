import { jest } from '@jest/globals';

jest.unstable_mockModule('../../services/emailService.js', () => ({
    sendPasswordResetEmail: jest.fn(),
}));

jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        sign: jest.fn(),
    },
}));

jest.unstable_mockModule('../../models/index.js', () => ({
    User: {
        findOne: jest.fn(),
    },
    sequelize: {},
}));

const authController = await import('../../controllers/authController.js');
const { User } = await import('../../models/index.js');
const { sendPasswordResetEmail } =
    await import('../../services/emailService.js');
const jwt = (await import('jsonwebtoken')).default;

describe('Auth Controller - Forgot Password', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    it('should return 400 if email is missing', async () => {
        req.body.email = '';
        await authController.forgotPassword(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email is required' });
    });

    it('should return success message even if user is not found (security)', async () => {
        req.body.email = 'nonexistent@example.com';
        User.findOne.mockResolvedValue(null);

        await authController.forgotPassword(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
        expect(res.json).toHaveBeenCalledWith({
            message:
                'If an account with that email exists, a password reset link has been sent.',
        });
        expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('should send email and return success message if user is found', async () => {
        const mockUser = { username: 'testuser', email: 'test@example.com' };
        req.body.email = 'test@example.com';
        User.findOne.mockResolvedValue(mockUser);
        jwt.sign.mockReturnValue('mock-token');

        await authController.forgotPassword(req, res);

        expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
        expect(jwt.sign).toHaveBeenCalledWith(
            { id: mockUser.username, email: mockUser.email, type: 'reset' },
            expect.any(String),
            { expiresIn: '1h' },
        );
        expect(sendPasswordResetEmail).toHaveBeenCalledWith(
            'test@example.com',
            expect.stringContaining('reset-password?token=mock-token'),
        );
        expect(res.json).toHaveBeenCalledWith({
            message:
                'If an account with that email exists, a password reset link has been sent.',
        });
    });

    it('should handle errors gracefully', async () => {
        req.body.email = 'test@example.com';
        const error = new Error('Database Error');
        User.findOne.mockRejectedValue(error);

        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {});

        await authController.forgotPassword(req, res);

        expect(consoleSpy).toHaveBeenCalledWith(
            'Forgot password error:',
            error,
        );
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'An error occurred while processing your request.',
        });
        consoleSpy.mockRestore();
    });
});
