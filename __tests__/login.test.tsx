import '@testing-library/jest-dom'; // For custom matchers like .toBeInTheDocument()
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Page from '@/app/(main)/login/page'; // Adjust the import based on your folder structure
import { useDispatch } from 'react-redux';
import axios from 'axios';

// Mocking useDispatch from react-redux
jest.mock('react-redux', () => ({
  useDispatch: jest.fn()
}));

// Mocking axios
jest.mock('axios');

// Mocking AuthForm component
jest.mock('@/components/form/AuthForm', () => ({
  __esModule: true,
  default: ({ onSubmit }: { onSubmit: (data: any) => void }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ username: 'test@example.com', password: 'test123' });
      }}
    >
      <button type='submit'>Login</button>
    </form>
  )
}));

describe('Login Page', () => {
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    mockDispatch = jest.fn();
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);

    // Mock axios to simulate a successful login response
    (axios.post as jest.Mock).mockResolvedValue({
      data: { token: 'mockToken', user: { id: 1, name: 'John Doe' } }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login page with heading and welcome message', () => {
    render(<Page />);

    const heading = screen.getByRole('heading', { name: /Login/i });
    const welcomeMessage = screen.getByText(/Welcome back! Please log in to your account/i);

    expect(heading).toBeInTheDocument();
    expect(welcomeMessage).toBeInTheDocument();
  });

  it('dispatches login action when form is submitted', async () => {
    render(<Page />);

    const loginButton = screen.getByRole('button', { name: /Login/i });

    fireEvent.click(loginButton);

    await waitFor(() => {
      const dispatchedThunk = mockDispatch.mock.calls[0][0];
      expect(dispatchedThunk).toBeInstanceOf(Function);

      return dispatchedThunk((action: any) => {
        // Check if the action contains the expected type
        expect(action.type).toMatch(/auth\/login\/pending|rejected|fulfilled/);
        if (action.type === 'auth/login/pending') {
          expect(action.meta.arg).toEqual({ username: 'test@example.com', password: 'test123' });
        } else if (action.type === 'auth/login/fulfilled') {
          expect(action.payload).toEqual({ token: 'mockToken', user: { id: 1, name: 'John Doe' } });
        }
      });
    });
  });
});
