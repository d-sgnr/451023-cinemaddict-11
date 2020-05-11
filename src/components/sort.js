import AbstractComponent from './abstract-component.js';
import {
  SortType
} from '../const.js';

const createSortMarkup = (sortButton, isActive) => {
  const {
    name
  } = sortButton;
  return (
    `<li><a href="#" data-sort-type="${name}" class="sort__button${isActive ? ` sort__button--active` : ``}">Sort by ${name}</a></li>`
  );
};

const createSortTemplate = (sortButtons) => {
  const sortMarkup = sortButtons.map((it) => createSortMarkup(it, it.active)).join(``);
  return (
    `<ul class="sort">
      ${sortMarkup}
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor(activeSortType) {
    super();

    this._sort = this._generateSorting(activeSortType);
  }

  getTemplate() {
    return createSortTemplate(this._sort);
  }

  getSortType() {
    return this._currenSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (evt.target.tagName !== `A`) {
        return;
      }
      const sortType = evt.target.dataset.sortType;

      if (this._currenSortType === sortType) {
        return;
      }

      this._currenSortType = sortType;

      handler(this._currenSortType);
    });
  }

  _generateSorting(activeSortType) {
    return Object.values(SortType).map((sortType) => {
      return {
        name: sortType,
        active: sortType === activeSortType,
      };
    });
  }
}
