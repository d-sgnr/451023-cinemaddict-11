import {
  createElement
} from '../utils.js';

const createMoviesBlockTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class MoviesBlock {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMoviesBlockTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
