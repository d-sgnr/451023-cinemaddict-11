import CommentComponent from '../components/comment.js';

import {
  render,
  remove
} from '../utils/render.js';

import {
  formatCommentDate
} from '../utils/common.js';

const commentDate = formatCommentDate(new Date());

export const EmptyComment = {
  id: Math.random(),
  text: ``,
  author: `Michael`,
  date: commentDate,
  avatar: `./images/emoji/smile.png`,
};

export default class CommentController {
  constructor(container, onCommentsChange) {
    this._container = container;
    this._onCommentsChange = onCommentsChange;
    // this._onViewChange = onViewChange;

    this._commentComponent = null;
  }

  render(comment) {
    this._commentComponent = new CommentComponent(comment);
    render(this._container, this._commentComponent);

    this._commentComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onCommentsChange(this, comment, null);
    });
  }

  destroy() {
    remove(this._commentComponent);
  }
}
