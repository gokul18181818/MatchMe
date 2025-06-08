import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from '../ThemeToggle';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('ThemeToggle', () => {
  it('toggles between dark and light themes', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const toggle = screen.getByRole('button');

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
