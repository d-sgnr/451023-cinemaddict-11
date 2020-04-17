import {
  createElement
} from '../utils.js';

import {
  FILTERS_NAMES
} from '../const.js';

const createFilterMarkup = (filter) => {
  const {
    name,
    qty
  } = filter;

  const allMoviesTitle = FILTERS_NAMES[0];
  const filterActiveClass = `main-navigation__item--active`;

  const getFilterLink = () => {
    return name.toString().toLowerCase();
  };

  const filterLink = getFilterLink();

  if (filter.name === allMoviesTitle) {
    return (
      `<a href="#all" class="main-navigation__item ${filterActiveClass}">
        ${name}
      </a>`
    );
  } else {
    return (
      `<a href="#${filterLink}" class="main-navigation__item">
        ${name}
        <span class="main-navigation__item-count">${qty}</span>
      </a>`
    );
  }
};

const createFilterTemplate = (filters) => {

  const filtersMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(``);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filtersMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
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
