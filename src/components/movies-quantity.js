import {
  getRandomNumber,
  insertSpacesIntoNumber
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

export {
  createMoviesQuantityTemplate
};
