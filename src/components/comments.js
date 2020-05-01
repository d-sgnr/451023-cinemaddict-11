import AbstractSmartComponent from "./abstract-smart-component.js";
import CommentComponent from '../components/comment.js';

import {
  render
} from '../utils/render.js';

import {
  EMOJIS
} from '../const.js';

import {
  maybePluralize
} from '../utils/common.js';

const createCommentsTemplate = (movie, options = {}) => {
  const {
    commentsQty
  } = movie;
  const {
    selectedEmoji
  } = options;

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

  const commentsWord = maybePluralize(`Comment`, commentsQty);

  return (
    `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">${commentsWord} <span class="film-details__comments-count">${commentsQty}</span></h3>

        <ul class="film-details__comments-list"></ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">
            ${selectedEmojiMarkup}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            ${emojisMarkup}
          </div>
        </div>
      </section>`
  );
};

export default class Comments extends AbstractSmartComponent {
  constructor(movie) {
    super();
    this._movie = movie;
    this._commentsQty = movie.commentsQty;
    this._selectedEmoji = null;

    this.setSelectedEmoji();
  }

  getTemplate() {
    return createCommentsTemplate(this._movie, {
      selectedEmoji: this._selectedEmoji
    });
  }

  recoveryListeners() {
    this.setSelectedEmoji();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    this._selectedEmoji = ``;

    this.rerender();
  }

  renderComments(comments) {
    const commentsList = this.getElement().querySelector(`.film-details__comments-list`);

    for (let i = 0; i < this._commentsQty; i++) {
      render(commentsList, new CommentComponent(comments[i]));
    }
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
}
