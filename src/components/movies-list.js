import AbstractComponent from './abstract-component.js';

const createMoviesListTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class MoviesList extends AbstractComponent {
  getTemplate() {
    return createMoviesListTemplate();
  }
}
