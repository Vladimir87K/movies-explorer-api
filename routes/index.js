const router = require('express').Router();
const userRoutes = require('./userRoutes');
const moviesRoutes = require('./moviesRoutes');
const { NotFoundError } = require('../errors/NotFoundError');
const { validationUserBody, validationAuthentification } = require('../errors/errors');
const { createUser, login } = require('../controllers/usersControllers');
const auth = require('../middlewares/auth');

router.post('/signup', validationUserBody, createUser);
router.post('/signin', validationAuthentification, login);
router.use(auth);
router.use('/', moviesRoutes);
router.use('/', userRoutes);

router.use((req, res, next) => {
  next(new NotFoundError('Заданный маршрут не найден'));
});

module.exports = router;
