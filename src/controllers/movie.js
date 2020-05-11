import MoviePopupComponent from '../components/movie-popup.js';
import MovieComponent from '../components/movie.js';
import CommentsFormComponent from '../components/comments-form.js';
import PopupComponent from '../components/popup.js';
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

const renderComments = (commentsListElement, comments, onCommentsChange) => {
  return comments.map((comment) => {
    const commentController = new CommentController(commentsListElement, onCommentsChange);

    commentController.render(comment);
    return commentController;
  });
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, commentsModel) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._commentsModel = commentsModel;

    this._comments = [];
    this._showedCommentControllers = [];

    this._onCommentsChange = this._onCommentsChange.bind(this);

    this._mode = Mode.DEFAULT;
    this._movieComponent = null;
    this._moviePopupComponent = null;
    this._commentComponent = null;
    this._commentsFormComponent = null;
    this._popupComponent = null;

    this._onControlEnterKeydown = this._onControlEnterKeydown.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
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
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isWatchlist: !movie.isWatchlist,
      }));
    });

    this._movieComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isWatched: !movie.isWatched,
      }));
    });

    this._movieComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isFavorite: !movie.isFavorite,
      }));
    });

    if (oldMoviePopupComponent && this._mode === Mode.POPUP) {
      replace(this._moviePopupComponent, oldMoviePopupComponent);
      this._renderMovieDetails(movie);
    }

    if (oldMovieComponent) {
      replace(this._movieComponent, oldMovieComponent);
    } else {
      render(this._container, this._movieComponent);
    }
  }

  destroy() {
    remove(this._movieComponent);
    remove(this._moviePopupComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
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

  _updateComments() {
    // const comments = this._commentsModel.getComments();
    //
    // this._removeComments();
    // this._renderComments(comments.slice(0, 4));
  }

  _onCommentsChange(commentController, oldData, newData) {
    if (oldData === EmptyComment) {
      // this._creatingComment = null;
      if (newData === null) {
        commentController.destroy();
      } else {
        this._commentsModel.addComment(newData);
        commentController.render(newData);
      }
    }

    if (newData === null) {
      commentController.destroy();
      this._commentsModel.removeComment(oldData.id);
      this._updateComments();
    }
  }

  _renderMoviePopup(movie) {

    const siteBodyElement = document.querySelector(`body`);

    this._popupComponent = new PopupComponent(movie);

    render(siteBodyElement, this._popupComponent);

    const commentsBlock = this._popupComponent.getElement().querySelector(`.film-details__comments-wrap`);

    this._commentsFormComponent = new CommentsFormComponent();

    render(commentsBlock, this._commentsFormComponent);

    document.addEventListener(`keydown`, this._onControlEnterKeydown);

    this._commentsFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._commentsFormComponent.getData();

      const commentsListElement = document.querySelector(`.film-details__comments-list`);

      const newCommentController = new CommentController(commentsListElement, this._onCommentsChange);

      this._onCommentsChange(newCommentController, EmptyComment, data);
    });

    this._renderMovieDetails(movie);

    this._onViewChange();
    this._mode = Mode.POPUP;

    document.addEventListener(`keydown`, this._onEscKeyDown);

    const comments = this._commentsModel.getComments();

    this._renderComments(comments);
  }

  _renderMovieDetails(movie) {
    const movieInfoContainer = document.querySelector(`.film-details__inner`);

    render(movieInfoContainer, this._moviePopupComponent, RenderPosition.AFTERBEGIN);

    this._moviePopupComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isFavorite: !movie.isFavorite,
      }));
    });

    this._moviePopupComponent.setWatchlistButtonClickHandler(() => {
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isWatchlist: !movie.isWatchlist,
      }));
    });

    this._moviePopupComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(this, movie, Object.assign({}, movie, {
        isWatched: !movie.isWatched,
      }));
    });

    this._moviePopupComponent.setPopupCloseClickHandler(this._closeMoviePopup.bind(this));
  }

  _renderComments(comments) {
    const commentsListElement = this._popupComponent.getElement().querySelector(`.film-details__comments-list`);

    const newComments = renderComments(commentsListElement, comments, this._onCommentsChange);

    this._showedCommentControllers = this._showedCommentControllers.concat(newComments);
  }

  createComment() {
    const commentsListElement = this._popupComponent.getElement().querySelector(`.film-details__comments-list`);

    const newComment = new CommentController(commentsListElement, this._onDataChange);

    newComment.render(EmptyComment);
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
