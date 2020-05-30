import {
  formatCommentDate
} from '../utils/common.js';

import AbstractSmartComponent from './abstract-smart-component.js';

import {
  DELETING_BUTTON_TEXT
} from '../const.js';

const DefaultData = {
  deleteButtonText: `Delete`,
};

const createCommentTemplate = (comment, options = {}) => {
  const {
    text,
    author,
    date,
    avatar
  } = comment;

  const {
    externalData
  } = options;

  const commentDate = formatCommentDate(date);

  const deleteButtonText = externalData.deleteButtonText;

  let isBlockDeleteButton = false;

  if (deleteButtonText === DELETING_BUTTON_TEXT) {
    isBlockDeleteButton = true;
  }

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="../images/emoji/${avatar}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author ? author : ``}</span>
          <span class="film-details__comment-day">${commentDate}</span>
          <button class="film-details__comment-delete" ${isBlockDeleteButton ? `disabled` : ``}>${deleteButtonText}</button>
        </p>
      </div>
    </li>`
  );
};

export default class Comment extends AbstractSmartComponent {
  constructor(comment) {
    super();
    this._comment = comment;
    this._externalData = DefaultData;

    this._deleteButtonClickHandler = null;
  }

  getTemplate() {
    return createCommentTemplate(this._comment, {
      externalData: this._externalData,
    });
  }

  removeElement() {
    super.removeElement();
  }

  recoveryListeners() {
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-delete`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }
}
