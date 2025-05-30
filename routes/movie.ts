import express from 'express';
import {
  validatePage
} from '../util/validation';
const router = express.Router();
const moviesController = require('../controller/movieController');


router.get('/', validatePage, moviesController.listAllMovies);



module.exports = router;