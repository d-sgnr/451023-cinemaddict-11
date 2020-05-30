import AbstractComponent from './abstract-component.js';

const createMoviePopupTemplate = () => {

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
      <div class="form-details__bottom-container">
        <section class="film-details__comments-wrap">
          <ul class="film-details__comments-list"></ul>
        </section>
      </div>
      </form>
    </section>`
  );
};

export default class MoviePopup extends AbstractComponent {

  getTemplate() {
    return createMoviePopupTemplate();
  }

}
