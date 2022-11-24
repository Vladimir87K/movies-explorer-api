const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { checkErrorValidation, checkErrorValidationId } = require('../errors/errors');

exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

exports.createMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      checkErrorValidation(err, next);
    });
};

exports.deleteMovies = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => { throw new NotFoundError('Видеозапись не найдена'); })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав на удаление фильма');
      }
      return movie.remove();
    })
    .then(() => res.status(200).send({ message: `Вы удалили фильм: ${req.params.movieId}` }))
    .catch((err) => {
      console.log(err.name, err.message, err.type);
      checkErrorValidationId(err, next);
    });
};
