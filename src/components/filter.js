import AbstractComponent from './abstract-component.js';
import {
  FilterType
} from '../const.js';

const getFilterName = (text) => {
  return text.replace(/[0-9]/g, ``).replace(/(\r\n|\n|\r)/gm, ``).trim();
};

const createFilterMarkup = (filter, isActive) => {
  const {
    name,
    count
  } = filter;

  const filterLink = name.toString().toLowerCase().split(` `)[0];

  return (
    `<a href="#${filterLink}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">${name} ${name === FilterType.ALL ? `` : `<span class="main-navigation__item-count">${count}</span>`}
    </a>`
  );
};

const createFilterTemplate = (filters) => {

  const filtersMarkup = filters.map((it) => createFilterMarkup(it, it.active)).join(``);

  return (
    `<div class="main-navigation__items">
        ${filtersMarkup}
      </div>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    const filters = this.getElement().querySelectorAll(`A`);
    filters.forEach((filter) => {
      filter.addEventListener(`click`, (evt) => {

        const filterName = getFilterName(evt.currentTarget.textContent);

        handler(filterName);
      });
    });
  }
}
