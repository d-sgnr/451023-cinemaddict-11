import {
  getRandomNumber,
  insertSpacesIntoNumber,
  createElement
} from '../utils.js';

import {
  MIN_MOVIES_TOTAL_QTY,
  MAX_MOVIES_TOTAL_QTY
} from '../const.js';

const createMoviesQuantityTemplate = () => {
  const moviesQuantity = insertSpacesIntoNumber(getRandomNumber(MIN_MOVIES_TOTAL_QTY, MAX_MOVIES_TOTAL_QTY));

  return (
    `<section class="footer__statistics">
      <p>${moviesQuantity} movies inside</p>
    </section>`
  );
};

export default class MoviesQuantity {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMoviesQuantityTemplate();
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
