import AbstractComponent from './abstract-component.js';
import {
  maybePluralize
} from '../utils/common.js';

const createPopupTemplate = (movie) => {
  const {
    commentsQty
  } = movie;

  const commentsWord = maybePluralize(`Comment`, commentsQty);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">

      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">${commentsWord} <span class="film-details__comments-count">${commentsQty}</span></h3>
          <ul class="film-details__comments-list"></ul>

        </section>
      </div>
      </form>
    </section>`
  );
};

export default class Popup extends AbstractComponent {
  constructor(movie) {
    super();

    this._movie = movie;
  }

  getTemplate() {
    return createPopupTemplate(this._movie);
  }
}
