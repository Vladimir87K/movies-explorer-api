const User = require('../models/user');

exports.getUsers = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

exports.updateProfil = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      checkErrorValidation(err, next);
    });
};