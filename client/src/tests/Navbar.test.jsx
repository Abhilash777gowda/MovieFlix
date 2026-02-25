/**
 * Navbar.test.jsx
 * Tests that the Navbar renders key navigation elements.
 * Firebase and AuthContext are mocked to avoid real network calls.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// ── Mocks ──────────────────────────────────────────────────────────────────

// Mock Firebase (Navbar imports AuthContext which imports firebase)
vi.mock('../firebase', () => ({
    auth: {},
    default: {},
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
    UserAuth: () => ({
        user: null,
        logOut: vi.fn(),
        googleSignIn: vi.fn(),
    }),
    AuthContextProvider: ({ children }) => <>{children}</>,
}));

// Mock ThemeContext
vi.mock('../context/ThemeContext', () => ({
    useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
}));

// Mock NotificationPanel (it makes API calls)
vi.mock('../components/NotificationPanel', () => ({
    default: () => <div data-testid="notification-panel" />,
}));

import Navbar from '../components/Navbar';

const renderNavbar = () =>
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Navbar', () => {
    beforeEach(() => {
        renderNavbar();
    });

    it('renders the MOVIEFLIX brand logo', () => {
        expect(screen.getByText('MOVIEFLIX')).toBeInTheDocument();
    });

    it('renders the Home navigation link', () => {
        expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    });

    it('renders the Movies navigation link', () => {
        expect(screen.getByRole('link', { name: /movies/i })).toBeInTheDocument();
    });

    it('renders the TV Shows navigation link', () => {
        expect(screen.getByRole('link', { name: /tv shows/i })).toBeInTheDocument();
    });

    it('renders the New & Popular navigation link', () => {
        expect(screen.getByRole('link', { name: /new & popular/i })).toBeInTheDocument();
    });

    it('renders the theme toggle button', () => {
        // The toggle button has a title attribute
        const btn = screen.getByTitle(/switch to/i);
        expect(btn).toBeInTheDocument();
    });

    it('renders the notification panel placeholder', () => {
        expect(screen.getByTestId('notification-panel')).toBeInTheDocument();
    });

    it('renders a sign in button when user is not logged in', () => {
        const signIn = screen.getByRole('button', { name: /sign in/i });
        expect(signIn).toBeInTheDocument();
    });
});
