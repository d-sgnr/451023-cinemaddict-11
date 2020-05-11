import AbstractComponent from './abstract-component.js';

const createMoviesQuantityTemplate = (moviesQuantity) => {
  return (
    `<section class="footer__statistics">
      <p>${moviesQuantity} movies inside</p>
    </section>`
  );
};

export default class MoviesQuantity extends AbstractComponent {
  constructor(moviesModel) {
    super();

    this._moviesModel = moviesModel;
  }
  getTemplate() {
    const movies = this._moviesModel.getMoviesAll();
    return createMoviesQuantityTemplate(movies.length);
  }
}
