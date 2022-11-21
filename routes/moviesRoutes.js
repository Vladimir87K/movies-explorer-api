const express = require('express');
const { celebrate, Joi } = require('celebrate');
const redex = require('../utils/utils');
const { getMovies, createMovies, deleteMovies } = require('../controllers/moviesControllers');

const moviesRoutes = express.Router();

moviesRoutes.get('/movies', getMovies);

moviesRoutes.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().min(2).required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(redex),
    trailerLink: Joi.string().pattern(redex),
    thumbnail: Joi.string().pattern(redex),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovies);

moviesRoutes.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().hex().length(24),
  }).unknown(true),
}), deleteMovies);

module.exports = moviesRoutes;
