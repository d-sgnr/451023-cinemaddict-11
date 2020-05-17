import PageComponent from "./components/page.js";
import PageController from "./controllers/page.js";
import FilterController from "./controllers/filter.js";
import ProfileAvatarComponent from './components/profile-avatar.js';
import FilterComponent from './components/filter.js';
import StatsComponent from './components/stats.js';
import MoviesQuantityComponent from './components/movies-quantity.js';
import MoviesModel from "./models/movies.js";
import SiteMenuComponent, {MenuItem} from "./components/site-menu.js";

import {
  generateMovies
} from './mocks/movie.js';

import {
  RenderPosition,
  render
} from './utils/render.js';
import {
  MOVIES_COUNT
} from './const.js';

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const movies = generateMovies(MOVIES_COUNT);
const moviesModel = new MoviesModel();
moviesModel.setMovies(movies);

const siteMenuComponent = new SiteMenuComponent();
render(siteMainElement, siteMenuComponent);

const siteMenuElement = document.querySelector(`.main-navigation`);

const filterController = new FilterController(siteMenuElement, moviesModel);
filterController.render();

//AVATAR

render(siteHeaderElement, new ProfileAvatarComponent(moviesModel));

//MOVIES QUANTITY

render(siteFooterElement, new MoviesQuantityComponent(moviesModel));

//RENDERING

const pageComponent = new PageComponent();
const pageController = new PageController(pageComponent, moviesModel);

render(siteMainElement, pageComponent);
pageController.render(movies);

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

//STATS

const statsComponent = new StatsComponent(moviesModel);

render(siteMainElement, statsComponent);

// MENU

siteMenuComponent.setOnChange((activeItem) => {
  switch (activeItem) {
    case MenuItem.STATS:
      filterController.setNotActiveView();
      pageController.hide();
      statsComponent.show();
      break;
    default:
      pageController.show();
      statsComponent.hide();
  }
});
