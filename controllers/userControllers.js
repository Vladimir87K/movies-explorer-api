const User = require('../models/user');
const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { checkErrorValidation } = require('../errors/errors');
const { ConflictError } = require('../errors/ConflictError');
const { BadRequestError } = require('../errors/BadRequestError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  User.findOne({ email }).then((film) => {
    if (film) {
      throw new ConflictError('Указанный Email уже сохранен');
    }
  });
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        email: user.email,
      },
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Указанный Email уже сохранен'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        // eslint-disable-next-line consistent-return
        .then((matched) => {
          if (matched) {
            const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' });
            res.status(200).send({ token });
          } else {
            throw new BadRequestError('Неправильные почта или пароль');
          }
        });
    })
    .catch(next);
};

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