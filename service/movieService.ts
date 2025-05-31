export { };
const { allMovies, getMovie, getRating } = require('../db');
const MovieApiError = require('../util/errors');

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

interface MovieDetails extends Movie {
    description: string;
    runtime: number;
    averageRating: number;
    originalLanguage: string;
    productionCompanies: string[];
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


async function getMovieDetails(imdbId: string): Promise<MovieDetails> {
    const sql = 'SELECT * FROM MOVIES WHERE IMDBID = ?';
    const movie = await getMovie(sql, [imdbId]);
    if (!movie) throw new MovieApiError(404, 'Movie not found');
    const ratingRow = await getRating(
      'SELECT AVG(rating) as avgRating FROM ratings WHERE movieId = ?',
      [movie.movieId]
    );
    const avg = ratingRow && ratingRow.avgRating ? parseFloat(ratingRow.avgRating) : 0;
    return {
      imdbId: movie.imdbId,
      title: movie.title,
      description: movie.overview,
      releaseDate: movie.releaseDate,
      budget: movie.budget,
      runtime: movie.runtime,
      averageRating: parseFloat(avg.toFixed(1)),
      genres: JSON.parse(movie.genres).map((g) => g.name),
      originalLanguage: movie.language,
      productionCompanies: JSON.parse(movie.productionCompanies).map((pc) => pc.name),
    };
  }
  

  async function listMoviesByYear(year: string, page = 1, order = 'ASC'): Promise<PaginatedResponse<Movie>> {
    if (page < 1) page = 1;
    const limit = 50;
    const offset = (page - 1) * limit;
    const sql = `
      SELECT imdbId, title, genres, releaseDate, budget
      FROM movies
      WHERE substr(releaseDate, 1, 4) = ?
      ORDER BY releaseDate ${order}
      LIMIT ? OFFSET ?
    `;
    const rows = await allMovies(sql, [year, limit, offset]);
    const data = rows.map((row) => ({
      imdbId: row.imdbId,
      title: row.title,
      genres: JSON.parse(row.genres).map((g) => g.name),
      releaseDate: row.releaseDate,
      budget: row.budget,
    }));
    return { page, data };
  }
  

  async function listMoviesByGenre(genre: string, page = 1): Promise<PaginatedResponse<Movie>> {
    if (page < 1) page = 1;
    const limit = 50;
    const offset = (page - 1) * limit;
    const genreLower = genre.toLowerCase();

    const likePattern = `%\"name\": \"${genreLower}\"%`;
    const sql = `
      SELECT imdbId, title, genres, releaseDate, budget
      FROM movies
      WHERE lower(genres) LIKE ?
      ORDER BY title ASC
      LIMIT ? OFFSET ?
    `;
    const rows = await allMovies(sql, [likePattern, limit, offset]);
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
    getMovieDetails,
    listMoviesByYear,
    listMoviesByGenre,
  };