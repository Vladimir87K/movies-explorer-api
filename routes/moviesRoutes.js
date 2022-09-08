const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { redex } = require('../utils/utils');

const moviesRoutes = express.Router();

moviesRoutes.get('/movies', getMovies);

moviesRoutes.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(redex),
    trailerLink: Joi.string().pattern(redex),
    thumbnail: Joi.string().pattern(redex),
    owner: Joi.string().alphanum().hex().length(24),
    movieId: Joi.string().alphanum().hex().length(24),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }).unknown(true),
}), createMovies);

moviesRoutes.delete('movies/_id', deleteMovies);

module.exports = moviesRoutes;