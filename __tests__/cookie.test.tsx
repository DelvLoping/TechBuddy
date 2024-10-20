import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '@/app/(main)/cookie/page';

describe('Cookie page', () => {
  it('renders without crashing', () => {
    render(<Page />);
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
  });
});
