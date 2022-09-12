const { default: isEmail } = require('validator/lib/isEmail');
const NotFoundError = require('./NotFoundError');
const BadRequestError = require('./BadRequestError');

const emailValidation = (email, next) => {
  if (!isEmail(email)) {
    next(new BadRequestError('Некорректно заполнен Email'));
  } else {
    next();
  }
};

const validationAuthentification = (req, res, next) => {
  const { email, password } = req.body;
  if (email !== '' && password !== '') {
    emailValidation(email, next);
  } else {
    next(new BadRequestError('Не заполнены требуемые поля'));
  }
};

const validationUserBody = (req, res, next) => {
  const { email, password, name } = req.body;
  if (email !== '' && password !== '' && name !== '') {
    emailValidation(email, next);
  } else {
    next(new BadRequestError('Переданы некорректные данные'));
  }
};

const errorUrl = () => {
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

const checkErrorsAll = (err, req, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
};

module.exports = {
  errorUrl,
  checkErrorsAll,
  checkErrorValidation,
  checkErrorValidationId,
  validationAuthentification,
  validationUserBody,
};
