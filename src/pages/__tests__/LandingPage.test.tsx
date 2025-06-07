import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../LandingPage';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('LandingPage', () => {
  it('shows call to action button', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <LandingPage />
        </ThemeProvider>
      </MemoryRouter>
    );

    expect(
      screen.getByRole('button', { name: /start your success story/i })
    ).toBeInTheDocument();
  });
});
