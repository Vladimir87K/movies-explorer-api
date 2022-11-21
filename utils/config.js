require('dotenv').config();

const { NODE_ENV, JWT_SECRET, DB_URL } = process.env;

let keySecret;
let dataMovies;
if (NODE_ENV === 'production') {
  keySecret = JWT_SECRET;
  dataMovies = DB_URL;
} else {
  keySecret = 'some-secret-key';
  dataMovies = 'mongodb://localhost:27017/moviesdb';
}

module.exports = {
  keySecret,
  dataMovies,
};
