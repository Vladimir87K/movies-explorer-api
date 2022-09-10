const express = require('express');
const { celebrate, Joi } = require('celebrate');
const redex = require('../utils/utils');
const { getMovies, createMovies, deleteMovies } = require('../controllers/moviesControllers');

const moviesRoutes = express.Router();

moviesRoutes.get('/movies', getMovies);

moviesRoutes.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().min(2).max(30).required(),
    director: Joi.string().min(2).max(30).required(),
    duration: Joi.number().min(2).required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(redex),
    trailerLink: Joi.string().pattern(redex),
    thumbnail: Joi.string().pattern(redex),
    owner: Joi.string().alphanum().hex().length(24),
    movieId: Joi.string().alphanum().hex().length(24),
    nameRU: Joi.string().min(2).required(),
    nameEN: Joi.string().min(2).required(),
  }).unknown(true),
}), createMovies);

moviesRoutes.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().hex().length(24),
  }).unknown(true),
}), deleteMovies);

module.exports = moviesRoutes;
