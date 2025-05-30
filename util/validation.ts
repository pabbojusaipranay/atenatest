import { Request, Response, NextFunction } from 'express';
const ApiError = require('../util/createError');


export const validatePage = (req: Request, res: Response, next: NextFunction) => {
  const { page } = req.query;
  if (page !== undefined) {
    const pageStr = String(page);
    const pageNum = parseInt(pageStr, 10);
    if (isNaN(pageNum) || pageNum < 1) {
      return next(new ApiError(400, 'Page param invalid', {
        param: 'page',
        message: 'Page should be a integer greater than or equal to 1',
      }));
    }
    req.query.page = pageNum.toString();
  }
  next();
};


export const validateYear = (req: Request, res: Response, next: NextFunction) => {
  const { year } = req.params;
  const yearRegex = /^\d{4}$/;
  const currentYear = new Date().getFullYear();
  if (!yearRegex.test(year) || Number(year) < 1800 || Number(year) > currentYear) {
    return next(new ApiError(400, 'Year param invalid', {
      param: 'year',
      message: `Year should be a 4-digit number between 1800 and ${currentYear}`,
    }));
  }
  next();
};


export const validateGenre = (req: Request, res: Response, next: NextFunction) => {
  const { genre } = req.params;
  if (!genre || typeof genre !== 'string' || !/^[a-zA-Z\s]+$/.test(genre)) {
    return next(new ApiError(400, 'Genre param invalid', {
      param: 'genre',
      message: 'Genre should be a non-empty string with only letters and spaces',
    }));
  }
  next();
};


export const validateMovieId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const idRegex = /^[A-Za-z0-9_-]+$/;
  if (!id || typeof id !== 'string' || !idRegex.test(id)) {
    return next(new ApiError(400, 'movie ID param invalid', {
      param: 'id',
      message: 'Movie ID should contain only letters, numbers, underscores, or hyphens',
    }));
  }
  next();
};


export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
  const { order } = req.query;
  if (order !== undefined) {
    const orderStr = String(order).toLowerCase();
    if (orderStr !== 'asc' && orderStr !== 'desc') {
      return next(new ApiError(400, 'Invalid order parameter', {
        param: 'order',
        message: 'Order should be either asc or desc',
      }));
    }
    req.query.order = orderStr;
  }
  next();
};