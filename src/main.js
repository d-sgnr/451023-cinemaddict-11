import {
  createFilterTemplate
} from './components/filter.js';
import {
  createUserAvatarTemplate
} from './components/user-avatar.js';
import {
  createSortingTemplate
} from './components/sorting.js';
import {
  createMoviesBlockTemplate
} from './components/movies-block.js';
import {
  createMoreButtonTemplate
} from './components/more-button.js';
import {
  createMoviesQuantityTemplate
} from './components/movies-quantity.js';
import {
  createMoviePopupTemplate
} from './components/movie-popup.js';
import {
  createMovieTemplate
} from './components/movie.js';
import {
  createCommentTemplate
} from './components/comments.js';
import {
  generateMovies
} from './mocks/movie.js';
import {
  generateFilters
} from './mocks/filter.js';
import {
  generateComments
} from './mocks/comments.js';
import {
  getRandomNumber
} from './utils.js';
import {
  generateAvatar
} from './mocks/avatar.js';

import {
  MIN_COMMENTS_QTY,
  MAX_COMMENTS_QTY
} from './const.js';

const MOVIES_COUNT = 19;
const MOVIES_COUNT_EXTRA = 2;
const MOVIES_FIRST_EXTRA_LIST = 0;
const MOVIES_SECOND_EXTRA_LIST = 1;
const FIRST_MOVIE = 0;
const SHOWING_MOVIES_COUNT_ON_START = 5;
const SHOWING_TASKS_COUNT_BY_BUTTON = 5;
const commentsQty = getRandomNumber(MIN_COMMENTS_QTY, MAX_COMMENTS_QTY);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const siteBodyElement = document.querySelector(`body`);

const movies = generateMovies(MOVIES_COUNT);
const comments = generateComments(commentsQty);
const filters = generateFilters();
const avatar = generateAvatar();

render(siteHeaderElement, createUserAvatarTemplate(avatar));
render(siteMainElement, createFilterTemplate(filters));
render(siteMainElement, createSortingTemplate());
render(siteMainElement, createMoviesBlockTemplate());
render(siteFooterElement, createMoviesQuantityTemplate());

const moviesListElement = document.querySelector(`.films-list .films-list__container`);
const moviesExtraListsElements = document.querySelectorAll(`.films-list--extra .films-list__container`);

const renderExtraMovies = (list) => {
  for (let i = 0; i < MOVIES_COUNT_EXTRA; i++) {
    render(moviesExtraListsElements[list], createMovieTemplate(movies[i]));
  }
};

let showingTasksCount = SHOWING_MOVIES_COUNT_ON_START;

movies.slice(0, SHOWING_MOVIES_COUNT_ON_START)
  .forEach((movie) => {
    render(moviesListElement, createMovieTemplate(movie));
  });

const moviesMainContainerElement = document.querySelector(`.films-list`);

renderExtraMovies(MOVIES_FIRST_EXTRA_LIST);
renderExtraMovies(MOVIES_SECOND_EXTRA_LIST);

//FILTERS

const filtersButtons = document.querySelectorAll(`.main-navigation__item`);

const makeFilterActive = (evt) => {
  for (let filter of filtersButtons) {
    filter.classList.remove(`main-navigation__item--active`);
  }
  evt.currentTarget.classList.add(`main-navigation__item--active`);
};

for (let filter of filtersButtons) {
  filter.addEventListener(`click`, makeFilterActive);
}

//LOAD-MORE

render(moviesMainContainerElement, createMoreButtonTemplate());

const loadMoreButton = moviesMainContainerElement.querySelector(`.films-list__show-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  movies.slice(prevTasksCount, showingTasksCount)
    .forEach((movie) => {
      render(moviesListElement, createMovieTemplate(movie));
    });

  if (showingTasksCount >= movies.length) {
    loadMoreButton.remove();
  }
});

//MOVIE-POPUP

render(siteBodyElement, createMoviePopupTemplate(movies[FIRST_MOVIE]));

const commentsListPopupElement = document.querySelector(`.film-details__comments-list`);

for (let i = 0; i < commentsQty; i++) {
  render(commentsListPopupElement, createCommentTemplate(comments[i]));
}

const popup = document.querySelector(`.film-details`);
const popupCloseButton = document.querySelector(`.film-details__close-btn`);

const closePopup = () => {
  popup.remove();
};

popupCloseButton.addEventListener(`click`, closePopup);
