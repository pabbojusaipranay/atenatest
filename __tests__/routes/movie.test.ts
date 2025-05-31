const request = require('supertest');
const app = require('../../app');

describe('Movies API routes', () => {
    test('GET /movies returns paginated list', async () => {
        const res = await request(app).get('/movies?page=1');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.meta.page).toBe(1);
    });

    test('GET /movies/year/:year returns list', async () => {
        const res = await request(app).get('/movies/year/2013?page=1&order=asc');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.meta.page).toBe(1);
    });

    test('GET /movies/:id returns movie details', async () => {
        const res = await request(app).get('/movies/tt1699720');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.imdbId).toBe('tt1699720');
    });

    test('GET /movies/abcxyz returns 404 error', async () => {
        const res = await request(app).get('/movies/abcxyz');
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toHaveProperty('message', 'Movie not found');
    });


    test('GET /movies/genre/:genre returns list', async () => {
        const res = await request(app).get('/movies/genre/Documentary?page=1');
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.meta.page).toBe(1);
    });
});