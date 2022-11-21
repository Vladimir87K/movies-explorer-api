const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, updateProfil,
} = require('../controllers/usersControllers');

const userRoutes = express.Router();

userRoutes.get('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
    password: Joi.string().required(),
  }),
}), getUsers);

userRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateProfil);

module.exports = userRoutes;
