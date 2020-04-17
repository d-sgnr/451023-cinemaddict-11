import {
  maybePluralize,
  createElement
} from '../utils.js';

import {MAX_DESCRIPTION_SYMBOLS} from '../const.js';

const createMovieTemplate = (movie) => {
  const {
    title,
    rating,
    year,
    duration,
    genre,
    poster,
    description,
    commentsQty
  } = movie;

  const watchlistButton = `<button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>`;
  const watchedButton = `<button class="film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>`;
  const favoriteButton = `<button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>`;

  const getMovieDescription = (descr) => {
    let visibleText = descr.slice(0, MAX_DESCRIPTION_SYMBOLS);

    if (descr.length > MAX_DESCRIPTION_SYMBOLS) {
      visibleText = `${visibleText}...`;
    } else {
      visibleText = descr;
    }

    return visibleText;
  };

  const commentsWord = maybePluralize(`comment`, commentsQty);

  const cardMovieDescription = getMovieDescription(description);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${cardMovieDescription}</p>
      <a class="film-card__comments">${commentsQty} ${commentsWord}</a>
      <form class="film-card__controls">
        ${watchlistButton}
        ${watchedButton}
        ${favoriteButton}
      </form>
    </article>`
  );
};

export default class Movie {
  constructor(movie) {
    this._movie = movie;

    this._element = null;
  }

  getTemplate() {
    return createMovieTemplate(this._movie);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
