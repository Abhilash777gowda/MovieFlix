/**
 * Search.test.jsx
 * Tests the Search page: renders input, shows empty state,
 * shows results when API resolves.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks (hoisted — must use factory functions) ──────────────────────────────

vi.mock('axios', () => {
    const mockResults = [
        { id: 10, title: 'Inception', backdrop_path: '/inc.jpg', poster_path: '/inc.jpg', vote_average: 8.8, release_date: '2010-07-16', adult: false, media_type: 'movie' },
        { id: 11, title: 'Interstellar', backdrop_path: '/int.jpg', poster_path: '/int.jpg', vote_average: 8.6, release_date: '2014-11-07', adult: false, media_type: 'movie' },
    ];
    return {
        default: {
            get: vi.fn().mockResolvedValue({ data: { results: mockResults } }),
        },
    };
});

vi.mock('../firebase', () => ({
    auth: {},
    default: {},
}));

vi.mock('../context/AuthContext', () => ({
    UserAuth: () => ({ user: null }),
    AuthContextProvider: ({ children }) => <>{children}</>,
}));

// Stub the Movie card to avoid its full API chain
vi.mock('../components/Movie', () => ({
    default: ({ item }) => (
        <div data-testid="movie-card">
            <span>{item.title}</span>
        </div>
    ),
}));

vi.mock('../components/MovieModal', () => ({
    default: () => <div data-testid="movie-modal" />,
}));

import Search from '../pages/Search';

// ── Helper ─────────────────────────────────────────────────────────────────

const renderSearch = () =>
    render(
        <MemoryRouter>
            <Search />
        </MemoryRouter>
    );

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Search page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the search input field', () => {
        renderSearch();
        // Actual placeholder: "Search movies, TV shows…"
        const input = screen.getByPlaceholderText(/search movies/i);
        expect(input).toBeInTheDocument();
    });

    it('shows idle state text when query is empty', () => {
        renderSearch();
        // Actual idle text from Search.jsx line 145
        expect(screen.getByText(/find your next watch/i)).toBeInTheDocument();
    });

    it('shows no movie cards when query is empty', () => {
        renderSearch();
        expect(screen.queryByTestId('movie-card')).toBeNull();
    });

    it('shows movie results after user types a query', async () => {
        const user = userEvent.setup();
        renderSearch();
        const input = screen.getByPlaceholderText(/search movies/i);
        await user.type(input, 'Inception');

        await waitFor(() => {
            expect(screen.getAllByTestId('movie-card').length).toBeGreaterThan(0);
        }, { timeout: 3000 });
    });

    it('shows the "All" genre filter tab after results load', async () => {
        const user = userEvent.setup();
        renderSearch();
        const input = screen.getByPlaceholderText(/search movies/i);
        await user.type(input, 'test');
        await waitFor(() => {
            expect(screen.getByText('All')).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});
