import AbstractComponent from './abstract-component.js';

const createPageTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class Page extends AbstractComponent {
  getTemplate() {
    return createPageTemplate();
  }
}
