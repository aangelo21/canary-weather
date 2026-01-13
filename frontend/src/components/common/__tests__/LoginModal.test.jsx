import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LoginModal from '../LoginModal';
import * as userService from '../../../services/userService';


vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key,
    }),
}));

vi.mock('react-router-dom', () => ({
    Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

vi.mock('../../../services/userService', () => ({
    loginUser: vi.fn(),
    createOrUpdateUser: vi.fn(),
    deleteUser: vi.fn(),
    fetchMunicipalities: vi.fn(),
    getCurrentUser: vi.fn(),
}));

describe('LoginModal', () => {
    const mockOnClose = vi.fn();
    const mockOnLogin = vi.fn();
    const mockOnLogout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        userService.fetchMunicipalities.mockResolvedValue([]);
    });

    it('should render login form by default', () => {
        render(
            <LoginModal
                isOpen={true}
                onClose={mockOnClose}
                onLogin={mockOnLogin}
                onLogout={mockOnLogout}
            />,
        );

        expect(screen.getByLabelText('emailOrUsername')).toBeInTheDocument();
        expect(screen.getByLabelText('password')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'signIn' }),
        ).toBeInTheDocument();
    });

    it('should switch to signup form', async () => {
        const user = userEvent.setup();
        render(
            <LoginModal
                isOpen={true}
                onClose={mockOnClose}
                onLogin={mockOnLogin}
                onLogout={mockOnLogout}
            />,
        );

        const switchButton = screen.getByText('signUp');
        await user.click(switchButton);

        expect(screen.getByLabelText('email')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'signUp' }),
        ).toBeInTheDocument();
    });

    it('should handle successful login', async () => {
        const user = userEvent.setup();
        const mockUser = { id: 1, username: 'testuser' };
        userService.loginUser.mockResolvedValue({ user: mockUser });

        render(
            <LoginModal
                isOpen={true}
                onClose={mockOnClose}
                onLogin={mockOnLogin}
                onLogout={mockOnLogout}
            />,
        );

        await user.type(screen.getByLabelText('emailOrUsername'), 'testuser');
        await user.type(screen.getByLabelText('password'), 'password123');
        await user.click(screen.getByRole('button', { name: 'signIn' }));

        await waitFor(() => {
            expect(userService.loginUser).toHaveBeenCalledWith({
                username: 'testuser',
                password: 'password123',
            });
            expect(mockOnLogin).toHaveBeenCalledWith(mockUser);
        });
    });
});
