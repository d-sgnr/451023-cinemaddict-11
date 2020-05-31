import MovieDetailsComponent from '../components/movie-details.js';
import MovieComponent from '../components/movie.js';
import CommentsFormComponent from '../components/comments-form.js';
import MoviePopupComponent from '../components/movie-popup.js';

import CommentsCount from '../components/comments-count.js';

import CommentController, {
  EmptyComment
} from '../controllers/comment.js';

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

const COMMENTS_LIST_CLASS = `.film-details__comments-list`;
const COMMENTS_WRAP_CLASS = `.film-details__comments-wrap`;
const MOVIE_DETAILS_CLASS = `.film-details__inner`;

const renderComments = (commentsListElement, comments, onCommentsChange, movie) => {
  return comments.map((comment) => {
    const commentController = new CommentController(commentsListElement, onCommentsChange, movie);

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
    this._movieDetailsComponent = null;
    this._commentComponent = null;
    this._commentsFormComponent = null;
    this._moviePopupComponent = null;
    this._commentsCountComponent = null;

    this._onControlEnterKeydown = this._onControlEnterKeydown.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._closeMoviePopup = this._closeMoviePopup.bind(this);
  }

  render(movie) {
    const oldMovieComponent = this._movieComponent;
    const oldMoviePopupComponent = this._movieDetailsComponent;

    this._movieComponent = new MovieComponent(movie);
    this._movieDetailsComponent = new MovieDetailsComponent(movie);

    this._movieComponent.setMovieCardClickHandler(() => {
      this._renderMoviePopup(movie);
    });

    this._movieComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onMovieOptionClick(`isWatchlist`, movie);
    });

    this._movieComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onMovieOptionClick(`isWatched`, movie);
    });

    this._movieComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onMovieOptionClick(`isFavorite`, movie);
    });

    if (oldMoviePopupComponent && this._mode === Mode.POPUP) {
      this._movieDetailsComponent.rerender();
    }

    if (oldMovieComponent) {
      replace(this._movieComponent, oldMovieComponent);
    } else {
      render(this._container, this._movieComponent);
    }
  }

  destroy() {
    remove(this._movieComponent);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeMoviePopup();
    }
  }

  _removeComments() {
    this._showedCommentControllers.forEach((commentController) => commentController.destroy());
    this._showedCommentControllers = [];
  }

  _onCommentsChange(commentController, oldData, newData, movie) {
    if (oldData === EmptyComment) {
      this._commentsFormComponent.blockForm(true);

      this._api.createComment(newData, movie.id)
        .then((commentModel) => {
          this._commentsFormComponent.reset();
          this._commentsModel.addComment(commentModel);
        })
        .then(
            this._api.getComments(movie.id)
              .then((comments) => {
                this._removeComments();
                this._renderComments(comments, movie);
                this._renderCommentsCount(this._commentsModel.getComments().length);
                this._commentsFormComponent.blockForm(false);

                movie.comments.push(movie.id);
                this._onDataChange(this, movie, true);
              }))
        .catch(() => {
          this._commentsFormComponent.blockForm(false);
          this._commentsFormComponent.shake();
        });
    }

    if (newData === null) {
      this._api.deleteComment(oldData.id)
        .then(() => {
          commentController.destroy();
          this._commentsModel.removeComment(oldData.id);
          this._removeComments();
          this._renderComments(this._commentsModel.getComments(), movie);
          this._renderCommentsCount(this._commentsModel.getComments().length);

          const movieComments = movie.comments;
          const index = movie.comments.indexOf(oldData.id);

          if (index > -1) {
            movieComments.splice(index, 1);
          }

          this._onDataChange(this, movie, true);
        })
        .catch(() => {
          commentController.shake();
        });
    }
  }

  _renderMoviePopup(movie) {

    const siteBodyElement = document.querySelector(`body`);

    this._moviePopupComponent = new MoviePopupComponent();

    render(siteBodyElement, this._moviePopupComponent);

    this._renderMovieDetails(movie);

    const commentsBlock = this._moviePopupComponent.getElement().querySelector(COMMENTS_WRAP_CLASS);

    const commentsCount = movie.comments.length;

    this._renderCommentsCount(commentsCount);

    this._commentsFormComponent = new CommentsFormComponent();

    render(commentsBlock, this._commentsFormComponent);

    document.addEventListener(`keydown`, this._onControlEnterKeydown);

    this._commentsFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._commentsFormComponent.getData();

      const commentsListElement = document.querySelector(COMMENTS_LIST_CLASS);

      const newCommentController = new CommentController(commentsListElement, this._onCommentsChange);

      this._onCommentsChange(newCommentController, EmptyComment, data, movie);
    });

    this._onViewChange();
    this._mode = Mode.POPUP;

    document.addEventListener(`keydown`, this._onEscKeyDown);

    this._api.getComments(movie.id)
      .then((comments) => {
        this._renderComments(comments, movie);
      });
  }

  _renderCommentsCount(count) {
    if (this._commentsCountComponent) {
      remove(this._commentsCountComponent);
    }

    this._commentsCountComponent = new CommentsCount(count);

    const commentsBlock = this._moviePopupComponent.getElement().querySelector(COMMENTS_WRAP_CLASS);

    render(commentsBlock, this._commentsCountComponent, RenderPosition.AFTERBEGIN);
  }

  _renderMovieDetails(movie) {
    const movieInfoContainer = document.querySelector(MOVIE_DETAILS_CLASS);

    render(movieInfoContainer, this._movieDetailsComponent, RenderPosition.AFTERBEGIN);

    this._movieDetailsComponent.setFavoritesButtonClickHandler(() => {
      this._onMovieOptionClick(`isFavorite`, movie);
    });

    this._movieDetailsComponent.setWatchlistButtonClickHandler(() => {
      this._onMovieOptionClick(`isWatchlist`, movie);
    });

    this._movieDetailsComponent.setWatchedButtonClickHandler(() => {
      this._onMovieOptionClick(`isWatched`, movie);
    });

    this._movieDetailsComponent.setPopupCloseClickHandler(this._closeMoviePopup.bind(this));
  }

  _renderComments(comments, movie) {
    const commentsListElement = this._moviePopupComponent.getElement().querySelector(COMMENTS_LIST_CLASS);

    const newComments = renderComments(commentsListElement, comments, this._onCommentsChange, movie);

    this._showedCommentControllers = this._showedCommentControllers.concat(newComments);

    this._commentsModel.setComments(comments);
  }

  _closeMoviePopup() {
    remove(this._moviePopupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    document.removeEventListener(`keydown`, this._onControlEnterKeydown);
    this._mode = Mode.DEFAULT;
  }

  _onControlEnterKeydown(evt) {
    isControlEnterKeyDown(evt, () => {
      const readyToSubmit = this._commentsFormComponent.isReadyToSubmit();

      if (readyToSubmit) {
        return;
      }
      this._moviePopupComponent.getElement().querySelector(MOVIE_DETAILS_CLASS).requestSubmit();
    });
  }

  _onMovieOptionClick(option, movie) {
    movie[option] = !movie[option];
    this._onDataChange(this, movie);
  }

  _onEscKeyDown(evt) {
    isEscKeyDown(evt, this._closeMoviePopup.bind(this));
  }
}
