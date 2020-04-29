import AbstractComponent from './abstract-component.js';

const createMoviesListContainerTemplate = () => {
  return (
    `<section class="films-list">
      <h2 class="films-list__title visually-hidden">
        All movies. Upcoming
      </h2>
    </section>`
  );
};

export default class MoviesListContainer extends AbstractComponent {
  getTemplate() {
    return createMoviesListContainerTemplate();
  }
}
