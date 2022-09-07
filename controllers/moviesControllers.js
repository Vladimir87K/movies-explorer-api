const Film = require('../models/film');

exports.getCards = (req, res, next) => {
  Film.find({})
    .populate('_id')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};