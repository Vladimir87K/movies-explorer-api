const NotFoundError = require('./NotFoundError');
const BadRequestError = require('./BadRequestError');
const { default: isEmail } = require('validator/lib/isEmail');

const validationAuthentification = (req, res, next) => {
  const { email, password } = req.body;
  if (isEmail(email) && password !== '') {
    next();
  } else {
    next(new BadRequestError('Переданы некорректные данные'));
  }
};

const validationUserBody = (req, res, next) => {
  const { email, password, name } = req.body;
  if (isEmail(email) && password !== '' && name!== '') {
    next();
  } else {
    next(new BadRequestError('Переданы некорректные данные'));
  }
}

// eslint-disable-next-line no-unused-vars
const errorUrl = (req, res) => {
  throw new NotFoundError('Указан некорректный Url');
};

const checkErrorValidation = (err, next) => {
  if (err.name === 'ValidationError') {
    next(new BadRequestError('Переданы некорректные данные'));
  } else {
    next(err);
  }
};

const checkErrorValidationId = (err, next) => {
  if (err.name === 'CastError') {
    next(new BadRequestError('Использовано некорректное Id'));
  } else {
    next(err);
  }
};

// eslint-disable-next-line consistent-return
const checkErrorsAll = (err, req, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
};

module.exports = {
  errorUrl, checkErrorsAll, checkErrorValidation, checkErrorValidationId, validationAuthentification, validationUserBody,
};
