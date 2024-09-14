import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '@/app/(main)/privacy-policy/page';

describe('Privacy page', () => {
  it('renders without crashing', () => {
    render(<Page />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });
});
