import AbstractSmartComponent from "./abstract-smart-component.js";

import CommentModel from "../models/comment.js";

import {
  EMOJIS
} from '../const.js';

import {
  encode
} from "he";

const parseFormData = (formData, avatar) => {
  return new CommentModel({
    "date": new Date(),
    "emotion": `${avatar}`,
    "comment": formData.get(`comment`),
  });
};


const createCommentsFormTemplate = (options = {}) => {

  const {
    selectedEmoji,
    commentText
  } = options;

  let encodedCommentText = ``;

  if (commentText) {
    encodedCommentText = encode(commentText);
  }

  const createSelectedEmojiMarkup = (emoji) => {
    if (emoji) {
      return (
        `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">`
      );
    }
    return ``;
  };

  const selectedEmojiMarkup = createSelectedEmojiMarkup(selectedEmoji);

  const createEmojisMarkup = (emojis, selected) => {
    return emojis
      .map((emoji) => {

        let isActive = true;

        if (emoji !== selected) {
          isActive = false;
        }

        return (
          `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isActive ? `checked` : ``}>

          <label class="film-details__emoji-label" for="emoji-${emoji}">
            <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="${emoji}">
          </label>`
        );
      })
      .join(`\n`);
  };

  const emojisMarkup = createEmojisMarkup(EMOJIS, selectedEmoji);

  return (
    `<div class="film-details__new-comment">
      <div for="add-emoji" class="film-details__add-emoji-label">
        ${selectedEmojiMarkup}
      </div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${encodedCommentText}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emojisMarkup}
      </div>
    </div>`
  );
};

export default class CommentsForm extends AbstractSmartComponent {
  constructor() {
    super();
    this._selectedEmoji = null;
    this._commentText = null;

    this.setSelectedEmoji();
    this.getCommentText();
  }

  getTemplate() {
    return createCommentsFormTemplate({
      selectedEmoji: this._selectedEmoji,
      commentText: this._commentText,
    });
  }

  recoveryListeners() {
    this.setSelectedEmoji();
    this.getCommentText();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    this._selectedEmoji = ``;
    this._commentText = ``;

    this.rerender();
  }

  getCommentText() {
    this.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, (evt) => {
        this._commentText = evt.target.value;
      });
  }

  setSelectedEmoji() {
    const element = this.getElement();
    const emojis = element.querySelectorAll(`.film-details__emoji-label`);

    emojis.forEach((emoji) => emoji.addEventListener(`click`, (evt) => {
      if (evt.target.tagName === `IMG`) {
        this._selectedEmoji = evt.target.alt;
      } else {
        this._selectedEmoji = evt.target.querySelector(`img`).alt;
      }

      this.rerender();
    }));
  }

  setSubmitHandler(handler) {
    document.querySelector(`.film-details__inner`)
      .addEventListener(`submit`, handler);
  }

  getData() {
    const form = document.querySelector(`.film-details__inner`);
    const formData = new FormData(form);

    return parseFormData(formData, this._selectedEmoji);
  }

  isReadyToSubmit() {
    if (!!this._selectedEmoji && !!this._commentText) {
      return false;
    }
    return true;
  }
}
