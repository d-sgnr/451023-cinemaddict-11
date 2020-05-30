import AbstractSmartComponent from "./abstract-smart-component.js";

import {
  formatDate,
  formatTime
} from '../utils/common.js';

const createButtonMarkup = (name, isActive = false) => {
  const buttonLabel =
    (name === `watchlist` ? `Add to ` : `Mark as `) + name;

  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${name}" name="${name}" ${isActive ? `checked` : ``}>
    <label for="${name}" class="film-details__control-label film-details__control-label--${name}">${buttonLabel}</label>`
  );
};

const createGenresMarkup = (genres) => {
  return (
    genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`)
  );
};

const createMovieDetailsTemplate = (movie) => {

  const {
    title,
    originalTitle,
    rating,
    director,
    writers,
    actors,
    date,
    duration,
    country,
    genre,
    poster,
    description,
    age,
    isWatchlist,
    isWatched,
    isFavorite
  } = movie;

  const movieDuration = formatTime(duration);
  const movieDate = formatDate(date);

  const watchlistButton = createButtonMarkup(`watchlist`, isWatchlist);
  const watchedButton = createButtonMarkup(`watched`, isWatched);
  const favoritesButton = createButtonMarkup(`favorite`, isFavorite);

  const genresMarkup = createGenresMarkup(genre);

  return (
    `<div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">
          <p class="film-details__age">${age}+</p>
        </div>
        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${originalTitle}</p>
            </div>
            <div class="film-details__rating">
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>
          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${movieDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${movieDuration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${country}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Genres</td>
              <td class="film-details__cell">
                ${genresMarkup}
              </td>
            </tr>
          </table>
          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>
      <section class="film-details__controls">
        ${watchlistButton}
        ${watchedButton}
        ${favoritesButton}
      <section>
    </div>`
  );
};

export default class MovieDetails extends AbstractSmartComponent {
  constructor(movie) {
    super();
    this._movie = movie;

    this._watchlistHandler = null;
    this._watchedHandler = null;
    this._favoritesHandler = null;
    this._popupCloseHandler = null;
  }

  getTemplate() {
    return createMovieDetailsTemplate(this._movie);
  }

  recoveryListeners() {
    this.setWatchlistButtonClickHandler(this._watchlistHandler);
    this.setWatchedButtonClickHandler(this._watchedHandler);
    this.setFavoritesButtonClickHandler(this._favoritesHandler);
    this.setPopupCloseClickHandler(this._popupCloseHandler);
  }

  rerender() {
    super.rerender();
  }

  setPopupCloseClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);

    this._popupCloseHandler = handler;
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, handler);

    this._watchlistHandler = handler;
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, handler);

    this._watchedHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, handler);

    this._favoritesHandler = handler;
  }
}
