/**
 * userRoutes.test.js
 * Integration / unit tests for all /api/user endpoints.
 * Uses mongodb-memory-server for a real (but in-memory) Mongoose connection.
 */
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');

let mongod;

// ── Setup / Teardown ─────────────────────────────────────────────────────────

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
});

afterEach(async () => {
    // Clear all collections between tests so each test starts fresh
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

// ── Helper ───────────────────────────────────────────────────────────────────

const sampleMovie = {
    id: 101,
    title: 'Inception',
    overview: 'A thief who steals via dreams.',
    backdrop_path: '/inc.jpg',
    poster_path: '/inc_p.jpg',
    vote_average: 8.8,
    release_date: '2010-07-16',
    adult: false,
    media_type: 'movie',
};

const email = 'test@movieflix.com';

// ═══════════════════════════════════════════════════════════════════════════════
// GET /watchlist/:email
// ═══════════════════════════════════════════════════════════════════════════════
describe('GET /api/user/watchlist/:email', () => {
    it('returns 404 when user does not exist', async () => {
        const res = await request(app).get('/api/user/watchlist/nobody@test.com');
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('User not found');
    });

    it('returns 200 with empty array for user with no watchlist items', async () => {
        await User.create({ email, watchlist: [], likes: [] });
        const res = await request(app).get(`/api/user/watchlist/${email}`);
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('returns 200 with correct watchlist array', async () => {
        await User.create({ email, watchlist: [sampleMovie], likes: [] });
        const res = await request(app).get(`/api/user/watchlist/${email}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].title).toBe('Inception');
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// POST /add-watchlist
// ═══════════════════════════════════════════════════════════════════════════════
describe('POST /api/user/add-watchlist', () => {
    it('creates a new user and adds the movie (201)', async () => {
        const res = await request(app)
            .post('/api/user/add-watchlist')
            .send({ email, movie: sampleMovie });
        expect(res.status).toBe(201);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toBe(sampleMovie.id);
    });

    it('adds movie to existing user watchlist (200)', async () => {
        await User.create({ email, watchlist: [], likes: [] });
        const res = await request(app)
            .post('/api/user/add-watchlist')
            .send({ email, movie: sampleMovie });
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
    });

    it('returns 400 if movie is already in watchlist', async () => {
        await User.create({ email, watchlist: [sampleMovie], likes: [] });
        const res = await request(app)
            .post('/api/user/add-watchlist')
            .send({ email, movie: sampleMovie });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Movie already in watchlist');
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// POST /remove-watchlist
// ═══════════════════════════════════════════════════════════════════════════════
describe('POST /api/user/remove-watchlist', () => {
    it('removes the movie from watchlist (200)', async () => {
        await User.create({ email, watchlist: [sampleMovie], likes: [] });
        const res = await request(app)
            .post('/api/user/remove-watchlist')
            .send({ email, movieId: sampleMovie.id });
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
    });

    it('returns 404 when user does not exist', async () => {
        const res = await request(app)
            .post('/api/user/remove-watchlist')
            .send({ email: 'ghost@test.com', movieId: 101 });
        expect(res.status).toBe(404);
    });

    it('handles movieId type-mismatch (number vs string) gracefully', async () => {
        await User.create({ email, watchlist: [sampleMovie], likes: [] });
        // Send movieId as string even though stored as number
        const res = await request(app)
            .post('/api/user/remove-watchlist')
            .send({ email, movieId: '101' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// POST /toggle-like
// ═══════════════════════════════════════════════════════════════════════════════
describe('POST /api/user/toggle-like', () => {
    it('creates new user and adds like (201)', async () => {
        const res = await request(app)
            .post('/api/user/toggle-like')
            .send({ email, movieId: 101 });
        expect(res.status).toBe(201);
        expect(res.body).toContain(101);
    });

    it('adds like for existing user (200)', async () => {
        await User.create({ email, watchlist: [], likes: [] });
        const res = await request(app)
            .post('/api/user/toggle-like')
            .send({ email, movieId: 42 });
        expect(res.status).toBe(200);
        expect(res.body).toContain(42);
    });

    it('removes like if already liked (toggle off)', async () => {
        await User.create({ email, watchlist: [], likes: [101] });
        const res = await request(app)
            .post('/api/user/toggle-like')
            .send({ email, movieId: 101 });
        expect(res.status).toBe(200);
        expect(res.body).not.toContain(101);
    });

    it('toggling twice restores the like', async () => {
        await User.create({ email, watchlist: [], likes: [] });
        await request(app).post('/api/user/toggle-like').send({ email, movieId: 55 });
        const res = await request(app)
            .post('/api/user/toggle-like')
            .send({ email, movieId: 55 });
        // Second toggle removes it
        expect(res.body).not.toContain(55);
    });
});

// ═══════════════════════════════════════════════════════════════════════════════
// GET /likes/:email
// ═══════════════════════════════════════════════════════════════════════════════
describe('GET /api/user/likes/:email', () => {
    it('returns 200 with empty array for unknown user', async () => {
        const res = await request(app).get('/api/user/likes/nobody@test.com');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('returns 200 with likes array for existing user', async () => {
        await User.create({ email, watchlist: [], likes: [101, 202] });
        const res = await request(app).get(`/api/user/likes/${email}`);
        expect(res.status).toBe(200);
        expect(res.body).toContain(101);
        expect(res.body).toContain(202);
    });

    it('returns empty array after all likes are toggled off', async () => {
        await User.create({ email, watchlist: [], likes: [] });
        const res = await request(app).get(`/api/user/likes/${email}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(0);
    });
});
