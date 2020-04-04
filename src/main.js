import {createSiteMenuTemplate} from './components/site-menu.js';
import {createUserAvatarTemplate} from './components/user-avatar.js';
import {createSortMoviesTemplate} from './components/sort-movies.js';
import {createMoviesBlockTemplate} from './components/movies-block.js';
import {createCardMovieTemplate} from './components/card-movie.js';
import {createButtonMoreTemplate} from './components/more-button.js';
import {createMoviesQuantityTemplate} from './components/movies-quantity.js';
import {createMoviePopupTemplate} from './components/movie-popup.js';

const CARDS_COUNT = 5;
const CARDS_COUNT_EXTRA = 2;
const CARDS_FIRST_EXTRA_LIST = 0;
const CARDS_SECOND_EXTRA_LIST = 1;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const siteBodyElement = document.querySelector(`body`);

render(siteHeaderElement, createUserAvatarTemplate());
render(siteMainElement, createSiteMenuTemplate());
render(siteMainElement, createSortMoviesTemplate());
render(siteMainElement, createMoviesBlockTemplate());
render(siteFooterElement, createMoviesQuantityTemplate());
render(siteBodyElement, createMoviePopupTemplate());

const moviesListElement = document.querySelector(`.films-list .films-list__container`);
const moviesExtraListsElements = document.querySelectorAll(`.films-list--extra .films-list__container`);

for (let i = 0; i < CARDS_COUNT; i++) {
  render(moviesListElement, createCardMovieTemplate());
}

const moviesMainContainerElement = document.querySelector(`.films-list`);

render(moviesMainContainerElement, createButtonMoreTemplate());

const renderExtraMovies = (list) => {
  for (let i = 0; i < CARDS_COUNT_EXTRA; i++) {
    render(moviesExtraListsElements[list], createCardMovieTemplate());
  }
};

renderExtraMovies(CARDS_FIRST_EXTRA_LIST);
renderExtraMovies(CARDS_SECOND_EXTRA_LIST);
