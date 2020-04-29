import MoviePopupComponent from '../components/movie-popup.js';
import MovieComponent from '../components/movie.js';
import CommentsComponent from '../components/comments.js';

import {
  generateComments
} from '../mocks/comments.js';

import {
  isEscKeyDown
} from '../utils/common.js';

import {
  render,
  remove,
  replace
} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._movieComponent = null;
    this._moviePopupComponent = null;
    this._commentsComponent = null;

    this._onEscKeyDownPopupClose = this._onEscKeyDownPopupClose.bind(this);

    this._closeMoviePopup = this._closeMoviePopup.bind(this);
  }

  render(movie) {
    const oldMovieComponent = this._movieComponent;
    const oldMoviePopupComponent = this._moviePopupComponent;

    this._moviePopupComponent = new MoviePopupComponent(movie);
    this._movieComponent = new MovieComponent(movie);

    this._movieComponent.setMovieCardClickHandler(() => {
      this._renderMoviePopup(movie);
    });

    // Card-Buttons-Listeners

    this._movieComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(movie, Object.assign({}, movie, {
        isWatchlist: !movie.isWatchlist,
      }));
    });

    this._movieComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(movie, Object.assign({}, movie, {
        isWatched: !movie.isWatched,
      }));
    });

    this._movieComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(movie, Object.assign({}, movie, {
        isFavorite: !movie.isFavorite,
      }));
    });

    if (oldMoviePopupComponent && this._mode === Mode.POPUP) {
      replace(this._moviePopupComponent, oldMoviePopupComponent);
      this._renderMoviePopup(movie);
    }

    if (oldMovieComponent) {
      replace(this._movieComponent, oldMovieComponent);
    } else {
      render(this._container, this._movieComponent);
    }
  }

  _renderMoviePopup(movie) {
    this._onViewChange();
    this._mode = Mode.POPUP;

    document.addEventListener(`keydown`, this._onEscKeyDownPopupClose);

    this._commentsComponent = new CommentsComponent(movie);

    const siteBodyElement = document.querySelector(`body`);
    render(siteBodyElement, this._moviePopupComponent);

    this._moviePopupComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(movie, Object.assign({}, movie, {
        isFavorite: !movie.isFavorite,
      }));
    });

    this._moviePopupComponent.setWatchlistButtonClickHandler(() => {
      this._onDataChange(movie, Object.assign({}, movie, {
        isWatchlist: !movie.isWatchlist,
      }));
    });

    this._moviePopupComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(movie, Object.assign({}, movie, {
        isWatched: !movie.isWatched,
      }));
    });

    // POPUP-CLOSE

    this._moviePopupComponent.setPopupCloseClickHandler(this._closeMoviePopup.bind(this));

    // COMMENTS-BLOCK

    const commentsBlock = document.querySelector(`.form-details__bottom-container`);

    render(commentsBlock, this._commentsComponent);

    // COMMENTS-LIST

    const comments = generateComments(movie.commentsQty);

    this._commentsComponent.renderComments(comments);
  }

  _closeMoviePopup() {
    document.removeEventListener(`keydown`, this._onEscKeyDownPopupClose);
    // this._commentsComponent.reset();
    remove(this._moviePopupComponent);
    this._mode = Mode.DEFAULT;
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeMoviePopup();
    }
  }

  _onEscKeyDownPopupClose(evt) {
    isEscKeyDown(evt, this._closeMoviePopup.bind(this));
  }
}
