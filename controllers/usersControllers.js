const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { checkErrorValidation } = require('../errors/errors');
const { keySecret } = require('../utils/config');
const ConflictError = require('../errors/ConflictError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const updateUser = (req, res, next, email, name) => {
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true })
    .then((userUpdate) => res.status(200).send({ data: userUpdate }))
    .catch((err) => {
      checkErrorValidation(err, next);
    });
};

exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
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
        .then((matched) => {
          if (matched) {
            const token = jwt.sign({ _id: user._id }, keySecret, { expiresIn: '7d' });
            res.status(200).send({ token });
          } else {
            throw new BadRequestError('Неправильные почта или пароль');
          }
        });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.findById(req.user)
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch(next);
};

exports.updateProfil = (req, res, next) => {
  const { email, name } = req.body;
  User.findById(req.user)
    .then((user) => {
      if (user.email === email) {
        updateUser(req, res, next, email, name);
      } else {
        User.find({ email })
          .then((user1) => {
            if (user1.length === 0) {
              updateUser(req, res, next, email, name);
            } else {
              next(new ConflictError('Пользователь с указанной почтой уже существует'));
            }
          })
          .catch(next);
      }
    });
};
