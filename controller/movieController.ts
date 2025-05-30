export {};
const movieService = require('../service/movieService');
const { success } = require('../util/apiResponseHandler');

/**
 * GET /movies
 * List all movies (paginated)
 */
exports.listAllMovies = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const { page: currentPage, data } = await movieService.listAllMovies(page);
    return success(res, data, { page: currentPage });
  } catch (err) {
    next(err);
  }
};