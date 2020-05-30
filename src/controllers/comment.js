import CommentComponent from '../components/comment.js';

import {
  render,
  remove
} from '../utils/render.js';

import {
  DELETING_BUTTON_TEXT,
  SHAKE_ANIMATION_TIMEOUT
} from '../const.js';

export const EmptyComment = {};

export default class CommentController {
  constructor(container, onCommentsChange, movie) {
    this._movie = movie;
    this._container = container;
    this._onCommentsChange = onCommentsChange;
    this._commentComponent = null;
  }

  render(comment) {
    this._commentComponent = new CommentComponent(comment);
    render(this._container, this._commentComponent);

    this._commentComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._commentComponent.setData({
        deleteButtonText: DELETING_BUTTON_TEXT,
      });
      this._onCommentsChange(this, comment, null, this._movie);
    });
  }

  shake() {
    this._commentComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._commentComponent.getElement().style.animation = ``;

      this._commentComponent.setData({
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  destroy() {
    remove(this._commentComponent);
  }
}
