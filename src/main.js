import ProfileAvatarComponent from './components/profile-avatar.js';
import CommentComponent from './components/comment.js';
import FilterComponent from './components/filter.js';
import LoadMoreButtonComponent from './components/load-more-button.js';
import MoviePopupComponent from './components/movie-popup.js';
import MovieComponent from './components/movie.js';
import MoviesBlockComponent from './components/movies-block.js';
import MoviesListComponent from './components/movies-list.js';
import MoviesListExtraComponent from './components/movies-list-extra.js';
import MoviesQuantityComponent from './components/movies-quantity.js';
import SortComponent from './components/sort.js';
import NoMoviesComponent from './components/no-movies.js';

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
  generateAvatar
} from './mocks/avatar.js';
import {
  getRandomNumber,
  render,
  RenderPosition,
  isEnterKeyDown,
  isEscKeyDown
} from "./utils.js";

import {
  MIN_COMMENTS_QTY,
  MAX_COMMENTS_QTY,
  MOVIES_COUNT,
  FIRST_MOVIE,
  SHOWING_MOVIES_COUNT_ON_START,
  SHOWING_TASKS_COUNT_BY_BUTTON,
  MOVIES_COUNT_EXTRA,
  TOP_RATED_BLOCK,
  MOST_COMMENTED_BLOCK,
  FIRST_EXTRA_LIST_TITLE,
  SECOND_EXTRA_LIST_TITLE
} from './const.js';

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);
const siteBodyElement = document.querySelector(`body`);

const movies = generateMovies(MOVIES_COUNT);
const filters = generateFilters();
const avatar = generateAvatar();

//AVATAR

render(siteHeaderElement, new ProfileAvatarComponent(avatar).getElement(), RenderPosition.BEFOREEND);

//FILTERS

render(siteMainElement, new FilterComponent(filters).getElement(), RenderPosition.BEFOREEND);

//SORT

render(siteMainElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);

//MOVIES QUANTITY

render(siteFooterElement, new MoviesQuantityComponent().getElement(), RenderPosition.BEFOREEND);

//MOVIE

const renderMovie = (moviesListElement, movie) => {
  const movieComponent = new MovieComponent(movie);

  render(moviesListElement, movieComponent.getElement(), RenderPosition.BEFOREEND);

  //POPUP

  const renderMoviePopup = (movie) => {
    const moviePopupComponent = new MoviePopupComponent(movie);
    const moviePopupElement = moviePopupComponent.getElement();

    render(siteBodyElement, moviePopupElement, RenderPosition.BEFOREEND);

    //POPUP-CLOSE

    const moviePopupCloseButton = moviePopupElement.querySelector(`.film-details__close-btn`);

    const closeMoviePopup = () => {
      document.removeEventListener(`keydown`, onEscKeyDownPopupClose);
      siteBodyElement.removeChild(moviePopupElement);
    };

    const onEscKeyDownPopupClose = (evt) => {
      isEscKeyDown(evt, closeMoviePopup);
    };

    moviePopupCloseButton.addEventListener(`click`, closeMoviePopup);

    document.addEventListener(`keydown`, onEscKeyDownPopupClose);

    //COMMENTS

    const comments = generateComments(movie.commentsQty);

    const commentsListPopupElement = document.querySelector(`.film-details__comments-list`);

    for (let i = 0; i < movie.commentsQty; i++) {
      render(commentsListPopupElement, new CommentComponent(comments[i]).getElement(), RenderPosition.BEFOREEND);
    }
  };

  //POPUP-OPEN

  const movieCover = movieComponent.getElement().querySelector(`.film-card__poster`);
  const movieTitle = movieComponent.getElement().querySelector(`.film-card__title`);
  const movieComments = movieComponent.getElement().querySelector(`.film-card__comments`);

  movieCover.addEventListener(`click`, () => {
    renderMoviePopup(movie);
    siteBodyElement.childNodes;
  });

  movieTitle.addEventListener(`click`, () => {
    renderMoviePopup(movie);
  });

  movieComments.addEventListener(`click`, () => {
    renderMoviePopup(movie);
  });
};

//MOVIES

const renderMoviesBlock = (moviesBlockComponent, movies) => {

  render(moviesBlockComponent.getElement(), new MoviesListComponent().getElement(), RenderPosition.BEFOREEND);

  const moviesMainContainerElement = moviesBlockComponent.getElement().querySelector(`.films-list`);

  if (movies.length === 0) {
    render(moviesMainContainerElement, new NoMoviesComponent().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  //MOVIES

  const moviesListElement = moviesBlockComponent.getElement().querySelector(`.films-list .films-list__container`);

  let showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

  movies.slice(0, showingMoviesCount)
    .forEach((movie) => {
      renderMovie(moviesListElement, movie);
    });

  //LOAD-MORE-BUTTON

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  const loadMoreButtonElement = loadMoreButtonComponent.getElement();

  render(moviesMainContainerElement, loadMoreButtonElement, RenderPosition.BEFOREEND);

  loadMoreButtonElement.addEventListener(`click`, () => {
    const prevMoviesCount = showingMoviesCount;
    showingMoviesCount = showingMoviesCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    movies.slice(prevMoviesCount, showingMoviesCount)
      .forEach((movie) => renderMovie(moviesListElement, movie));

    if (showingMoviesCount >= movies.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  });

  //MOVIES-EXTRA

  render(moviesBlockComponent.getElement(), new MoviesListExtraComponent(FIRST_EXTRA_LIST_TITLE).getElement(), RenderPosition.BEFOREEND);
  render(moviesBlockComponent.getElement(), new MoviesListExtraComponent(SECOND_EXTRA_LIST_TITLE).getElement(), RenderPosition.BEFOREEND);

  const moviesTopRatedBlock = moviesBlockComponent.getElement().querySelectorAll(`.films-list--extra .films-list__container`)[TOP_RATED_BLOCK];
  const moviesMostCommentedBlock = moviesBlockComponent.getElement().querySelectorAll(`.films-list--extra .films-list__container`)[MOST_COMMENTED_BLOCK];

  movies.slice(0, MOVIES_COUNT_EXTRA)
    .forEach((movie) => {
      renderMovie(moviesTopRatedBlock, movie),
        renderMovie(moviesMostCommentedBlock, movie);
    });
};

//RENDERING

const moviesBlockComponent = new MoviesBlockComponent();

renderMoviesBlock(moviesBlockComponent, movies);

render(siteMainElement, moviesBlockComponent.getElement(), RenderPosition.BEFOREEND);
