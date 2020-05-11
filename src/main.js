import PageComponent from "./components/page.js";
import PageController from "./controllers/page.js";
import FilterController from "./controllers/filter.js";
import ProfileAvatarComponent from './components/profile-avatar.js';
import FilterComponent from './components/filter.js';
import MoviesQuantityComponent from './components/movies-quantity.js';
import MoviesModel from "./models/movies.js";

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

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render();

//AVATAR

render(siteHeaderElement, new ProfileAvatarComponent(moviesModel));


//MOVIES QUANTITY

render(siteFooterElement, new MoviesQuantityComponent(moviesModel));

//RENDERING

const boardComponent = new PageComponent();
const boardController = new PageController(boardComponent, moviesModel);

render(siteMainElement, boardComponent);
boardController.render(movies);
