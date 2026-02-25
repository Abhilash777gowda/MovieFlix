/**
 * requests.test.js
 * Tests that all TMDB URL strings are correctly formed.
 */
import requests from '../requests';

const API_KEY = '92b44f51a2134bda7e85c0ff1a41de6b';
const BASE_URL = 'https://api.themoviedb.org/3';

describe('requests.js — TMDB URL strings', () => {
    it('exports a non-empty object', () => {
        expect(typeof requests).toBe('object');
        expect(Object.keys(requests).length).toBeGreaterThan(0);
    });

    it('every URL starts with the correct base URL', () => {
        Object.values(requests).forEach(url => {
            expect(url).toMatch(new RegExp(`^${BASE_URL.replace('.', '\\.')}`));
        });
    });

    it('every URL contains the API key', () => {
        Object.values(requests).forEach(url => {
            expect(url).toContain(`api_key=${API_KEY}`);
        });
    });

    // ── Home ──
    it('requestPopular points to /movie/popular', () => {
        expect(requests.requestPopular).toContain('/movie/popular');
    });

    it('requestTopRated points to /movie/top_rated', () => {
        expect(requests.requestTopRated).toContain('/movie/top_rated');
    });

    it('requestTrending points to /trending/all/day', () => {
        expect(requests.requestTrending).toContain('/trending/all/day');
    });

    it('requestHorror uses genre 27 (Horror)', () => {
        expect(requests.requestHorror).toContain('with_genres=27');
    });

    it('requestUpcoming points to /movie/upcoming', () => {
        expect(requests.requestUpcoming).toContain('/movie/upcoming');
    });

    // ── Genre requests ──
    it('requestAction uses genre 28', () => {
        expect(requests.requestAction).toContain('with_genres=28');
    });

    it('requestComedy uses genre 35', () => {
        expect(requests.requestComedy).toContain('with_genres=35');
    });

    it('requestDrama uses genre 18', () => {
        expect(requests.requestDrama).toContain('with_genres=18');
    });

    it('requestSciFi uses genre 878', () => {
        expect(requests.requestSciFi).toContain('with_genres=878');
    });

    it('requestAnimation uses genre 16', () => {
        expect(requests.requestAnimation).toContain('with_genres=16');
    });

    it('requestThriller uses genre 53', () => {
        expect(requests.requestThriller).toContain('with_genres=53');
    });

    // ── TV ──
    it('requestTVPopular points to /tv/popular', () => {
        expect(requests.requestTVPopular).toContain('/tv/popular');
    });

    it('requestTVTopRated points to /tv/top_rated', () => {
        expect(requests.requestTVTopRated).toContain('/tv/top_rated');
    });

    it('requestTVAiringToday points to /tv/airing_today', () => {
        expect(requests.requestTVAiringToday).toContain('/tv/airing_today');
    });

    it('requestTVOnAir points to /tv/on_the_air', () => {
        expect(requests.requestTVOnAir).toContain('/tv/on_the_air');
    });

    // ── Trending page ──
    it('requestTrendingMovies points to /trending/movie/week', () => {
        expect(requests.requestTrendingMovies).toContain('/trending/movie/week');
    });

    it('requestTrendingTV points to /trending/tv/week', () => {
        expect(requests.requestTrendingTV).toContain('/trending/tv/week');
    });

    it('requestNowPlaying points to /movie/now_playing', () => {
        expect(requests.requestNowPlaying).toContain('/movie/now_playing');
    });
});
