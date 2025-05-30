export { };
const { allMovies } = require('../db');

interface Movie {
    imdbId: string;
    title: string;
    genres: string[];
    releaseDate: string;
    budget: string;
}


interface PaginatedResponse<T> {
    page: number;
    data: T[];
}


async function listAllMovies(page = 1): Promise<PaginatedResponse<Movie>> {
    
    const limit = 50;

    if (page < 1) page = 1;

    const offset = (page - 1) * limit;
    const sql = `
    SELECT IMDBID, TITLE, GENRES, RELEASEDATE, BUDGET
    FROM MOVIES
    ORDER BY TITLE ASC
    LIMIT ? OFFSET ?
  `;
    const rows = await allMovies(sql, [limit, offset]);
    const data = rows.map((row) => ({
        imdbId: row.imdbId,
        title: row.title,
        genres: JSON.parse(row.genres).map((g) => g.name),
        releaseDate: row.releaseDate,
        budget: row.budget,
    }));
    return { page, data };
}

module.exports = {
    listAllMovies,
};