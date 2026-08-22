import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginScreen from './LoginScreen';
import { vi } from 'vitest';

describe('LoginScreen Component', () => {
  it('renders correctly with email and password inputs', () => {
    const mockOnLogin = vi.fn();
    render(<LoginScreen onLogin={mockOnLogin} />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/player@blackouthockey\.com/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /LOGIN/i })).toBeInTheDocument();
  });

  it('calls onLogin callback when the form is submitted', async () => {
    const mockOnLogin = vi.fn();
    const user = userEvent.setup();
    render(<LoginScreen onLogin={mockOnLogin} />);

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /LOGIN/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(loginButton);

    expect(mockOnLogin).toHaveBeenCalledTimes(1);
  });
});
