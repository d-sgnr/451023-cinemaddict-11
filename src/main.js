import PageComponent from "./components/page.js";
import PageController from "./controllers/page.js";
import FilterController from "./controllers/filter.js";
import ProfileAvatarComponent from './components/profile-avatar.js';
import StatsComponent from './components/stats.js';
import MoviesQuantityComponent from './components/movies-quantity.js';
import MoviesModel from "./models/movies.js";

import SiteMenuComponent, {
  MenuItem
} from "./components/site-menu.js";

import {
  render
} from './utils/render.js';

import API from "./api.js";

import {
  AUTHORIZATION,
  END_POINT,
} from './const.js';

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

const api = new API(END_POINT, AUTHORIZATION);

const moviesModel = new MoviesModel();

const siteMenuComponent = new SiteMenuComponent();
render(siteMainElement, siteMenuComponent);

const siteMenuElement = document.querySelector(`.main-navigation`);

const filterController = new FilterController(siteMenuElement, moviesModel);
filterController.render();

const pageComponent = new PageComponent();
const pageController = new PageController(pageComponent, moviesModel, api);

render(siteMainElement, pageComponent);

const getStatistics = () => {
  const statsComponent = new StatsComponent(moviesModel);
  render(siteMainElement, statsComponent);
  statsComponent.hide();

  siteMenuComponent.setOnChange((activeItem) => {
    switch (activeItem) {
      case MenuItem.STATS:
        statsComponent.setMovies(moviesModel.getModel());
        filterController.setNotActiveView();
        pageController.hide();
        statsComponent.show();
        break;
      default:
        pageController.show();
        statsComponent.hide();
    }
  });
};

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    pageController.render();
    getStatistics();

    render(siteHeaderElement, new ProfileAvatarComponent(moviesModel));
    render(siteFooterElement, new MoviesQuantityComponent(moviesModel));
  });
