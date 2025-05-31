import express from 'express';
import {
  pageValidator, yearValidator, orderValidator, genreValidator, movieIdValidator
} from '../util/validation';
const router = express.Router();
const moviesController = require('../controller/movieController');


router.get('/', pageValidator, moviesController.listAllMovies);

router.get(
    '/year/:year',
    yearValidator,
    orderValidator,
    pageValidator,
    moviesController.moviesByYear
  );
  

  router.get(
    '/genre/:genre',
    genreValidator,
    pageValidator,
    moviesController.moviesByGenre
  );
  

  router.get('/:id', movieIdValidator, moviesController.movieDetails);
  
  module.exports = router;