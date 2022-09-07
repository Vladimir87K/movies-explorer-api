const router = require('express').Router();
const userRoutes = require('./userRoutes');
const moviesRoutes = require('./moviesRoutes');
const { NotFoundError } = require('../errors/NotFoundError');

router.post('./signup', validationUserBody, createUser);
router.post('./signin',  validationAuthentification, login);
router.use('./user', auth, userRoutes);
router.use('./movies', auth, moviesRoutes);

router.use((req, res, next) => {
  next(new NotFoundError('Заданный маршрут не найден'))
});

module.exports = router;