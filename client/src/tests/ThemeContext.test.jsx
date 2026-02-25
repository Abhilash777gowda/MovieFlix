/**
 * ThemeContext.test.jsx
 * Tests the dark/light mode toggle, localStorage persistence,
 * and html class manipulation.
 */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

// Helper component that exposes theme state in the DOM
const ThemeConsumer = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme-value">{theme}</span>
            <button onClick={toggleTheme} data-testid="toggle-btn">Toggle</button>
        </div>
    );
};

const renderWithTheme = () =>
    render(
        <ThemeProvider>
            <ThemeConsumer />
        </ThemeProvider>
    );

describe('ThemeContext', () => {
    beforeEach(() => {
        localStorage.clear();
        // Reset html classes
        document.documentElement.classList.remove('light', 'dark');
    });

    it('defaults to dark mode when no localStorage value exists', () => {
        renderWithTheme();
        expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    });

    it('reads saved theme from localStorage on mount', () => {
        localStorage.setItem('movieflix_theme', 'light');
        renderWithTheme();
        expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });

    it('toggleTheme switches dark → light', async () => {
        const user = userEvent.setup();
        renderWithTheme();
        expect(screen.getByTestId('theme-value').textContent).toBe('dark');
        await user.click(screen.getByTestId('toggle-btn'));
        expect(screen.getByTestId('theme-value').textContent).toBe('light');
    });

    it('toggleTheme switches light → dark', async () => {
        localStorage.setItem('movieflix_theme', 'light');
        const user = userEvent.setup();
        renderWithTheme();
        await user.click(screen.getByTestId('toggle-btn'));
        expect(screen.getByTestId('theme-value').textContent).toBe('dark');
    });

    it('persists theme in localStorage after toggle', async () => {
        const user = userEvent.setup();
        renderWithTheme();
        await user.click(screen.getByTestId('toggle-btn'));
        expect(localStorage.getItem('movieflix_theme')).toBe('light');
    });

    it('adds .light class to html element in light mode', async () => {
        const user = userEvent.setup();
        renderWithTheme();
        await user.click(screen.getByTestId('toggle-btn'));
        expect(document.documentElement.classList.contains('light')).toBe(true);
    });

    it('adds .dark class to html element in dark mode', () => {
        renderWithTheme();
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes .dark class when switching to light', async () => {
        const user = userEvent.setup();
        renderWithTheme();
        await user.click(screen.getByTestId('toggle-btn'));
        expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
});
