import {
  POSTERS,
  DESCRIPTION_TEXT,
  TITLES,
  GENRES,
  YEARS,
  DIRECTORS,
  ACTORS,
  WRITERS,
  COUNTRIES,
  MONTH_NAMES,
  AGE,
  MIN_SENTENCES_QTY,
  MAX_SENTENCES_QTY,
  MIN_RATING,
  MAX_RATING,
  MIN_COMMENTS_QTY,
  MAX_COMMENTS_QTY
} from '../const.js';

import {
  getRandomItem,
  getRandomText,
  getRandomNumber
} from '../utils.js';

const generateMovie = () => {
  const randomPoster = getRandomItem(POSTERS);
  const randomDescription = getRandomText(DESCRIPTION_TEXT, MIN_SENTENCES_QTY, MAX_SENTENCES_QTY);
  const randomTitle = getRandomItem(TITLES);
  const randomGenre = getRandomItem(GENRES);
  const randomYear = getRandomItem(YEARS);
  const randomRating = getRandomNumber(MIN_RATING, MAX_RATING, true);
  const randomDuration = `${getRandomNumber(1, 3)}h ${getRandomNumber(1, 59)}m`;
  const randomDirector = getRandomItem(DIRECTORS);
  const randomActors = ACTORS.join(`, `);
  const randomWriters = WRITERS.join(`, `);
  const randomCountry = getRandomItem(COUNTRIES);
  const randomDay = getRandomNumber(1, 31);
  const randomMonth = getRandomItem(MONTH_NAMES);
  const randomAge = getRandomItem(AGE);

  const randomCommentsQty = getRandomNumber(MIN_COMMENTS_QTY, MAX_COMMENTS_QTY);

  return {
    title: randomTitle,
    originalTitle: randomTitle,
    rating: randomRating,
    director: randomDirector,
    writers: randomWriters,
    actors: randomActors,
    date: `${randomDay} ${randomMonth} ${randomYear}`,
    country: randomCountry,
    year: randomYear,
    duration: randomDuration,
    genre: `${randomGenre}`,
    genres: `${randomGenre} ${randomGenre} ${randomGenre}`,
    poster: randomPoster,
    description: randomDescription,
    age: `${randomAge}`,
    commentsQty: randomCommentsQty,
  };
};

const generateMovies = (qty) => {
  return new Array(qty).fill(``).map(generateMovie);
};

export {
  generateMovie,
  generateMovies
};
