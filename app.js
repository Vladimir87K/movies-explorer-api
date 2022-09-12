const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

const { checkErrorsAll } = require('./errors/errors');
const limiter = require('./utils/limiter');

app.use(requestLogger);

app.use(limiter);

app.use(helmet());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
})
  .then(() => console.log('Connected db'))
  .catch((e) => console.log(e));

app.use((req, res, next) => {
  console.log(`${req.method}: ${req.path} ${JSON.stringify(req.body)}`);
  next();
});

app.use(cors());

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  checkErrorsAll(err, req, res);
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
