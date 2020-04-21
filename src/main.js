import PageComponent from "./components/page.js";
import PageController from "./controllers/page.js";
import ProfileAvatarComponent from './components/profile-avatar.js';
import FilterComponent from './components/filter.js';
import MoviesQuantityComponent from './components/movies-quantity.js';

import {
  generateMovies
} from './mocks/movie.js';
import {
  generateFilters
} from './mocks/filter.js';
import {
  generateAvatar
} from './mocks/avatar.js';
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
const filters = generateFilters();
const avatar = generateAvatar();

//AVATAR

render(siteHeaderElement, new ProfileAvatarComponent(avatar));

//FILTERS

render(siteMainElement, new FilterComponent(filters));


//MOVIES QUANTITY

render(siteFooterElement, new MoviesQuantityComponent());

//RENDERING

const boardComponent = new PageComponent();
const boardController = new PageController(boardComponent);

render(siteMainElement, boardComponent);
boardController.render(movies);
