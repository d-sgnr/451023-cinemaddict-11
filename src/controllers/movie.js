// import API from "../api.js";

import MoviePopupComponent from '../components/movie-popup.js';
import MovieComponent from '../components/movie.js';
import CommentsFormComponent from '../components/comments-form.js';
import PopupComponent from '../components/popup.js';

import CommentsCount from '../components/comments-count.js';

import CommentController, {
  EmptyComment
} from '../controllers/comment.js';

import MovieModel from "../models/movie.js";

import {
  isEscKeyDown,
  isControlEnterKeyDown
} from '../utils/common.js';

import {
  render,
  remove,
  replace,
  RenderPosition
} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  POPUP: `popup`,
};

// const AUTHORIZATION = `Basic dXNlckBwYXNzd29yZAo=`;
// const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
//
// const api = new API(END_POINT, AUTHORIZATION);

const renderComments = (commentsListElement, comments, onCommentsChange) => {
  return comments.map((comment) => {
    const commentController = new CommentController(commentsListElement, onCommentsChange);

    commentController.render(comment);
    return commentController;
  });
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, commentsModel, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._commentsModel = commentsModel;
    this._api = api;

    this._comments = [];
    this._showedCommentControllers = [];

    this._onCommentsChange = this._onCommentsChange.bind(this);

    this._mode = Mode.DEFAULT;
    this._movieComponent = null;
    this._moviePopupComponent = null;
    this._commentComponent = null;
    this._commentsFormComponent = null;
    this._popupComponent = null;
    this._commentsCountComponent = null;

    this._onControlEnterKeydown = this._onControlEnterKeydown.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._closeMoviePopup = this._closeMoviePopup.bind(this);
  }

  render(movie) {
    const oldMovieComponent = this._movieComponent;
    const oldMoviePopupComponent = this._moviePopupComponent;

    this._movieComponent = new MovieComponent(movie);
    this._moviePopupComponent = new MoviePopupComponent(movie);

    this._movieComponent.setMovieCardClickHandler(() => {
      this._renderMoviePopup(movie);
    });

    // Card-Buttons-Listeners

    this._movieComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(movie);
      newMovie.isWatchlist = !newMovie.isWatchlist;
      this._onDataChange(this, movie, newMovie);
    });

    this._movieComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(movie);
      newMovie.isWatched = !newMovie.isWatched;
      this._onDataChange(this, movie, newMovie);
    });

    this._movieComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      const newMovie = MovieModel.clone(movie);
      newMovie.isFavorite = !newMovie.isFavorite;
      this._onDataChange(this, movie, newMovie);
    });

    if (oldMoviePopupComponent && this._mode === Mode.POPUP) {
      this._moviePopupComponent.rerender();

      document.addEventListener(`keydown`, this._onEscKeyDown);
    }

    if (oldMovieComponent) {
      replace(this._movieComponent, oldMovieComponent);
    } else {
      render(this._container, this._movieComponent);
    }
  }

  destroy() {
    remove(this._movieComponent);
    // remove(this._moviePopupComponent);
    // console.log(`destroyed`);
    // document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeMoviePopup();
    }
  }

  createComment() {
    const commentsListElement = this._popupComponent.getElement().querySelector(`.film-details__comments-list`);

    const newComment = new CommentController(commentsListElement, this._onDataChange);

    newComment.render(EmptyComment);
  }

  _removeComments() {
    this._showedCommentControllers.forEach((commentController) => commentController.destroy());
    this._showedCommentControllers = [];
  }

  _updateComments() {
    // const comments = this._commentsModel.getComments();
    //
    // this._removeComments();
    // this._renderComments(comments.slice(0, 4));
  }

  _onCommentsChange(commentController, oldData, newData, id) {
    if (oldData === EmptyComment) {
      this._api.createComment(newData, id)
        .then((commentModel) => {
          this._commentsModel.addComment(commentModel);
        })
          .then(
              this._api.getComments(id)
                .then((comments) => {
                  this._removeComments();
                  this._renderComments(comments);
                  this._renderCommentsCount(this._commentsModel.getComments().length);
                }));
      // const newMovie = MovieModel.clone(movie);
      // newMovie.isWatchlist = !newMovie.isWatchlist;
      // this._onDataChange(this, movie, newMovie);
    }

    if (newData === null) {
      this._api.deleteComment(oldData.id)
        .then(() => {
          commentController.destroy();
          this._commentsModel.removeComment(oldData.id);
          this._removeComments();
          this._renderComments(this._commentsModel.getComments());
          this._renderCommentsCount(this._commentsModel.getComments().length);
        });
    }
  }

  _renderMoviePopup(movie) {

    const siteBodyElement = document.querySelector(`body`);

    this._popupComponent = new PopupComponent();

    render(siteBodyElement, this._popupComponent);

    const commentsBlock = this._popupComponent.getElement().querySelector(`.film-details__comments-wrap`);

    const commentsCount = movie.comments.length;

    this._renderCommentsCount(commentsCount);

    this._commentsFormComponent = new CommentsFormComponent();

    render(commentsBlock, this._commentsFormComponent);

    document.addEventListener(`keydown`, this._onControlEnterKeydown);

    this._commentsFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._commentsFormComponent.getData();

      const commentsListElement = document.querySelector(`.film-details__comments-list`);

      const newCommentController = new CommentController(commentsListElement, this._onCommentsChange);

      this._onCommentsChange(newCommentController, EmptyComment, data, movie.id);
    });

    this._renderMovieDetails(movie);

    this._onViewChange();
    this._mode = Mode.POPUP;

    document.addEventListener(`keydown`, this._onEscKeyDown);

    // const comments = this._commentsModel.getComments();

    this._api.getComments(movie.id)
      .then((comments) => {
        // moviesModel.setMovies(movies);
        this._renderComments(comments);
      });

    // this._renderComments(comments);
  }

  _renderCommentsCount(count) {
    if (this._commentsCountComponent) {
      remove(this._commentsCountComponent);
    }

    this._commentsCountComponent = new CommentsCount(count);

    const commentsBlock = this._popupComponent.getElement().querySelector(`.film-details__comments-wrap`);

    render(commentsBlock, this._commentsCountComponent, RenderPosition.AFTERBEGIN);
  }

  _renderMovieDetails(movie) {
    const movieInfoContainer = document.querySelector(`.film-details__inner`);

    render(movieInfoContainer, this._moviePopupComponent, RenderPosition.AFTERBEGIN);

    this._moviePopupComponent.setFavoritesButtonClickHandler(() => {
      const newMovie = MovieModel.clone(movie);
      newMovie.isFavorite = !newMovie.isFavorite;
      this._onDataChange(this, movie, newMovie);
    });

    this._moviePopupComponent.setWatchlistButtonClickHandler(() => {
      const newMovie = MovieModel.clone(movie);
      newMovie.isWatchlist = !newMovie.isWatchlist;
      this._onDataChange(this, movie, newMovie);
    });

    this._moviePopupComponent.setWatchedButtonClickHandler(() => {
      const newMovie = MovieModel.clone(movie);
      newMovie.isWatched = !newMovie.isWatched;
      this._onDataChange(this, movie, newMovie);
    });

    this._moviePopupComponent.setPopupCloseClickHandler(this._closeMoviePopup.bind(this));
  }

  _renderComments(comments) {
    const commentsListElement = this._popupComponent.getElement().querySelector(`.film-details__comments-list`);

    const newComments = renderComments(commentsListElement, comments, this._onCommentsChange);

    this._showedCommentControllers = this._showedCommentControllers.concat(newComments);

    this._commentsModel.setComments(comments);
  }

  _closeMoviePopup() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    remove(this._popupComponent);
    this._mode = Mode.DEFAULT;
  }

  _onControlEnterKeydown(evt) {
    isControlEnterKeyDown(evt, () => {
      const readyToSubmit = this._commentsFormComponent.isReadyToSubmit();
      if (readyToSubmit) {
        return;
      }
      this._popupComponent.getElement().querySelector(`.film-details__inner`).requestSubmit();
    });
  }

  _onEscKeyDown(evt) {
    isEscKeyDown(evt, this._closeMoviePopup.bind(this));
  }
}
