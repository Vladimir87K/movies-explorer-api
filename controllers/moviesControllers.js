const Film = require('../models/film');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { checkErrorValidation } = require('../errors/errors');

exports.getCards = (req, res, next) => {
  Film.find({})
    .populate('_id')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

exports.createMovies = (req, res, next) => {
  const { country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN } = req.body;
  Film.create({ country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN , owner: req.user._id })
    .then((film) => res.send({ data: film }))
    .catch((err) => {
      checkErrorValidation(err, next);
    });
};

exports.deleteMovies = (req, res, next) => {
  Film.findById(req.params.filmId)
    .orFail(() => { throw new NotFoundError('Видеозапись не найдена'); })
    .then((film) => {
      if (film.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав на удаление фильма');
      }
      return card.remove();
    })
    .then(() => res.status(200).send({ message: `Вы удалили фильм: ${req.params.filmId}` }))
    .catch((err) => {
      checkErrorValidationId(err, next);
    });
};