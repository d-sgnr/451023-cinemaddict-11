import {formatCommentDate} from '../utils/common.js';

import AbstractComponent from './abstract-component.js';

const createCommentTemplate = (comment) => {
  const {
    text,
    author,
    date,
    avatar
  } = comment;

  const commentDate = formatCommentDate(date);

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${avatar}" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

export default class Comment extends AbstractComponent {
  constructor(comment) {
    super();
    this._comment = comment;
  }

  getTemplate() {
    return createCommentTemplate(this._comment);
  }
}
