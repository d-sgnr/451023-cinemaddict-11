import {
  POSTERS,
  DESCRIPTION_TEXT,
  TITLES,
  GENRES,
  DIRECTORS,
  ACTORS,
  WRITERS,
  COUNTRIES,
  AGE,
  MIN_SENTENCES_QTY,
  MAX_SENTENCES_QTY,
  MIN_RATING,
  MAX_RATING,
  MIN_COMMENTS_QTY,
  MAX_COMMENTS_QTY
} from '../const.js';

import {
  formatDuration,
  formatDate,
  getRandomDate,
  getRandomItem,
  getRandomText,
  getRandomNumber
} from '../utils/common.js';

const movieWatchingDate = getRandomDate();

const generateMovie = () => {
  const randomPoster = getRandomItem(POSTERS);
  const randomDescription = getRandomText(DESCRIPTION_TEXT, MIN_SENTENCES_QTY, MAX_SENTENCES_QTY);
  const randomTitle = getRandomItem(TITLES);
  const randomGenre = getRandomItem(GENRES);
  const randomRating = getRandomNumber(MIN_RATING, MAX_RATING, true);
  const randomDuration = formatDuration(168);
  const randomDirector = getRandomItem(DIRECTORS);
  const randomActors = ACTORS.join(`, `);
  const randomWriters = WRITERS.join(`, `);
  const randomCountry = getRandomItem(COUNTRIES);
  const randomAge = getRandomItem(AGE);
  const randomCommentsQty = getRandomNumber(MIN_COMMENTS_QTY, MAX_COMMENTS_QTY);
  const randomDate = getRandomDate();

  return {
    id: Math.random(),
    title: randomTitle,
    originalTitle: randomTitle,
    rating: randomRating,
    director: randomDirector,
    writers: randomWriters,
    actors: randomActors,
    date: formatDate(randomDate),
    country: randomCountry,
    year: formatDate(randomDate, true),
    duration: randomDuration,
    genre: `${randomGenre}`,
    genres: `${randomGenre} ${randomGenre} ${randomGenre}`,
    poster: randomPoster,
    description: randomDescription,
    age: `${randomAge}`,
    commentsQty: randomCommentsQty,
    isWatchlist: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
    watchingDate: movieWatchingDate,
  };
};

const generateMovies = (qty) => {
  return new Array(qty).fill(``).map(generateMovie);
};

export {
  generateMovie,
  generateMovies
};
