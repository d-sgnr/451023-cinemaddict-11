import AbstractComponent from './abstract-smart-component.js';
import {
  maybePluralize
} from '../utils/common.js';

const createCommentsCountTemplate = (count) => {

  const commentsWord = maybePluralize(`Comment`, count);

  return (
    `<h3 class="film-details__comments-title">${commentsWord} <span class="film-details__comments-count">${count}</span></h3>`
  );
};

export default class CommentsCount extends AbstractComponent {
  constructor(count) {
    super();

    this._commentsCount = count;
  }

  getTemplate() {
    return createCommentsCountTemplate(this._commentsCount);
  }

}
