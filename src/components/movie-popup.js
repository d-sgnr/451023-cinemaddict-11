import {
  maybePluralize,
  createElement
} from '../utils.js';

const createMoviePopupMarkup = (movie) => {
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
    genres,
    poster,
    description,
    age
  } = movie;

  const createGenresMarkup = () => {

    const movieGenre = genre;
    const movieGenres = genres;

    const movieGenresArray = movieGenres.split(` `);

    if (movieGenre === movieGenres) {
      return (
        `<span class="film-details__genre">${movie.genre}</span>`
      );
    }
    return (
      movieGenresArray.map((it) => `<span class="film-details__genre">${it}</span>`).join(`\n`)
    );
  };

  const genresMarkup = createGenresMarkup();

  return (
    `<div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

        <p class="film-details__age">${age}</p>
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
            <td class="film-details__cell">${date}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell">${duration}</td>
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
    </div>`
  );
};

const createMovieCommentsPopupMarkup = (movie) => {
  const commentsWord = maybePluralize(`Comment`, movie.commentsQty);

  return (
    `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">${commentsWord} <span class="film-details__comments-count">${movie.commentsQty}</span></h3>

        <ul class="film-details__comments-list"></ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>`
  );
};

const createMoviePopupTemplate = (movie) => {

  const watchlistButton =
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
    <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>`;

  const watchedButton =
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
    <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>`;

  const favoriteButton =
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
    <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>`;

  const moviePopupMarkup = createMoviePopupMarkup(movie);
  const movieCommentsPopupMarkup = createMovieCommentsPopupMarkup(movie);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          ${moviePopupMarkup}
          <section class="film-details__controls">
            ${watchlistButton}
            ${watchedButton}
            ${favoriteButton}
          <section>
        </div>
        <div class="form-details__bottom-container">
          ${movieCommentsPopupMarkup}
        </div>
      </form>
    </section>`
  );
};

export default class MoviePopup {
  constructor(movie) {
    this._movie = movie;

    this._element = null;
  }

  getTemplate() {
    return createMoviePopupTemplate(this._movie);
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
