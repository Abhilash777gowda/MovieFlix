/**
 * Movie.test.jsx
 * Tests the Movie card component renders correctly and shows modal on click.
 * Axios and AuthContext are mocked to avoid network calls.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('axios', () => ({
    default: {
        get: vi.fn().mockResolvedValue({ data: [] }),
        post: vi.fn().mockResolvedValue({ data: {} }),
    },
}));

vi.mock('../firebase', () => ({ auth: {}, default: {} }));

vi.mock('../context/AuthContext', () => ({
    UserAuth: () => ({ user: null }),
}));

// MovieModal is large and makes API calls — stub it
vi.mock('../components/MovieModal', () => ({
    default: ({ onClose }) => (
        <div data-testid="movie-modal">
            <button onClick={onClose}>Close</button>
        </div>
    ),
}));

import Movie from '../components/Movie';

// ── Fixture ────────────────────────────────────────────────────────────────

const mockMovie = {
    id: 1,
    title: 'Test Movie',
    overview: 'A test movie overview.',
    backdrop_path: '/test_backdrop.jpg',
    poster_path: '/test_poster.jpg',
    vote_average: 8.2,
    release_date: '2024-03-15',
    adult: false,
    media_type: 'movie',
};

// ── Tests ──────────────────────────────────────────────────────────────────

describe('Movie card', () => {
    it('renders the movie thumbnail image', () => {
        render(<Movie item={mockMovie} />);
        const img = screen.getByRole('img', { name: /test movie/i });
        expect(img).toBeInTheDocument();
        expect(img.src).toContain('image.tmdb.org');
    });

    it('uses a fallback image when no backdrop or poster is provided', () => {
        const movieWithoutImage = { ...mockMovie, backdrop_path: null, poster_path: null };
        render(<Movie item={movieWithoutImage} />);
        const img = screen.getByRole('img');
        expect(img.src).toContain('unsplash');
    });

    it('opens the MovieModal when the Play button is clicked', () => {
        render(<Movie item={mockMovie} />);
        const playBtn = screen.getByTitle('Play');
        fireEvent.click(playBtn);
        expect(screen.getByTestId('movie-modal')).toBeInTheDocument();
    });

    it('opens the MovieModal when the Info button is clicked', () => {
        render(<Movie item={mockMovie} />);
        const infoBtn = screen.getByTitle('More Info');
        fireEvent.click(infoBtn);
        expect(screen.getByTestId('movie-modal')).toBeInTheDocument();
    });

    it('closes the MovieModal when onClose is called', () => {
        render(<Movie item={mockMovie} />);
        fireEvent.click(screen.getByTitle('Play'));
        expect(screen.getByTestId('movie-modal')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: /close/i }));
        expect(screen.queryByTestId('movie-modal')).not.toBeInTheDocument();
    });

    it('shows Watchlist button', () => {
        render(<Movie item={mockMovie} />);
        expect(screen.getByTitle('Add to List')).toBeInTheDocument();
    });

    it('shows Like button', () => {
        render(<Movie item={mockMovie} />);
        expect(screen.getByTitle('Like')).toBeInTheDocument();
    });
});
