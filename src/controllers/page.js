import MoviesListComponent from '../components/movies-list.js';
import MoviesListContainerComponent from '../components/movies-list-container.js';
import MoviesListExtraComponent from '../components/movies-list-extra.js';

import LoadMoreButtonComponent from '../components/load-more-button.js';
import SortComponent from '../components/sort.js';
import NoMoviesComponent from '../components/no-movies.js';
import MovieController from '../controllers/movie.js';

import CommentsModel from "../models/comments.js";

import {
  sortArray
} from '../utils/common.js';
import {
  render,
  remove,
  RenderPosition
} from '../utils/render.js';

import API from '../api.js';

import {
  SortType,
  AUTHORIZATION,
  END_POINT,
  SHOWING_MOVIES_COUNT_ON_START,
  SHOWING_MOVIES_COUNT_BY_BUTTON,
  MOVIES_COUNT_EXTRA,
  TOP_RATED_BLOCK,
  MOST_COMMENTED_BLOCK,
  FIRST_EXTRA_LIST_TITLE,
  SECOND_EXTRA_LIST_TITLE
} from '../const.js';

const COMMENTS_KEY = `comments`;

const api = new API(END_POINT, AUTHORIZATION);

const commentsModel = new CommentsModel();

const renderMovies = (moviesListElement, movies, onDataChange, onViewChange) => {
  return movies.map((movie) => {
    const movieController = new MovieController(moviesListElement, onDataChange, onViewChange, commentsModel, api);
    movieController.render(movie);
    return movieController;
  });
};

const getSortedMovies = (movies, sortType, from, to) => {
  let sortedMovies = [];
  const showingMovies = movies.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedMovies = showingMovies.sort(sortArray(`year`));
      break;
    case SortType.RATING:
      sortedMovies = showingMovies.sort(sortArray(`rating`));
      break;
    case COMMENTS_KEY:
      sortedMovies = showingMovies.sort(sortArray(COMMENTS_KEY, false, true));
      break;
    case SortType.DEFAULT:
      sortedMovies = showingMovies;
      break;
  }

  return sortedMovies.slice(from, to);
};

export default class PageController {
  constructor(container, moviesModel, apiItem) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._api = apiItem;

    this._movies = [];
    this._showedMovieControllers = [];

    this._showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;
    this._noMoviesComponent = null;
    this._sortComponent = null;
    this._moviesListComponent = new MoviesListComponent();
    this._moviesListContainerComponent = new MoviesListContainerComponent();

    this._moviesListTopRated = new MoviesListExtraComponent(FIRST_EXTRA_LIST_TITLE);
    this._moviesListMostCommented = new MoviesListExtraComponent(SECOND_EXTRA_LIST_TITLE);

    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._activeSortType = SortType.DEFAULT;
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    const movies = this._moviesModel.getMovies();

    render(container, this._moviesListContainerComponent);

    render(this._moviesListContainerComponent.getElement(), this._moviesListComponent);

    if (movies.length === 0) {
      this._renderNoMovies(container);
    }

    const moviesToShow = movies.slice(0, this._showingMoviesCount);

    this._renderSorting();

    this._renderMovies(moviesToShow);

    this._renderLoadMoreButton();

    this._renderMoviesExtraBlock(SortType.RATING, TOP_RATED_BLOCK, this._moviesListTopRated);
    this._renderMoviesExtraBlock(COMMENTS_KEY, MOST_COMMENTED_BLOCK, this._moviesListMostCommented);
  }

  _renderMovies(movies) {
    const container = this._moviesListContainerComponent.getElement();

    if (this._noMoviesComponent !== null) {
      remove(this._noMoviesComponent);
    }

    if (movies.length === 0) {
      this._renderNoMovies(container);
      return;
    }

    const moviesListElement = this._moviesListComponent.getElement();

    const newMovies = renderMovies(moviesListElement, movies, this._onDataChange, this._onViewChange);

    this._showedMovieControllers = this._showedMovieControllers.concat(newMovies);

    this._showingMoviesCount = this._showedMovieControllers.length;
  }

  _renderNoMovies(container) {
    this._noMoviesComponent = new NoMoviesComponent();
    render(container, this._noMoviesComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSorting(sortType = SortType.DEFAULT) {
    if (this._sortComponent) {
      remove(this._sortComponent);
    }
    const container = this._container.getElement();
    this._sortComponent = new SortComponent(sortType);
    render(container, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _removeMovies() {
    this._showedMovieControllers.forEach((movieController) => movieController.destroy());
    this._showedMovieControllers = [];
  }

  _renderLoadMoreButton() {
    const movies = this._moviesModel.getMovies();

    const container = this._moviesListContainerComponent.getElement();

    remove(this._loadMoreButtonComponent);

    if (this._showingMoviesCount >= movies.length) {
      return;
    }

    render(container, this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  _onLoadMoreButtonClick() {

    const movies = this._moviesModel.getMovies();

    const prevMoviesCount = this._showingMoviesCount;
    this._showingMoviesCount = this._showingMoviesCount + SHOWING_MOVIES_COUNT_BY_BUTTON;

    const sortedMovies = getSortedMovies(movies, this._activeSortType, prevMoviesCount, this._showingMoviesCount);

    this._renderMovies(sortedMovies);

    if (this._showingMoviesCount >= movies.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderMoviesExtraBlock(sortType, block, component) {
    const movies = this._moviesModel.getMoviesAll();

    const container = this._container.getElement();

    render(container, component);

    const moviesExtraContainer = container.querySelectorAll(`.films-list--extra .films-list__container`)[block];

    const extraMovies = getSortedMovies(movies, sortType, 0, MOVIES_COUNT_EXTRA);

    renderMovies(moviesExtraContainer, extraMovies, this._onDataChange, this._onViewChange);
  }

  _rerenderMoviesExtraBlocks() {
    remove(this._moviesListTopRated);
    remove(this._moviesListMostCommented);

    this._moviesListTopRated = new MoviesListExtraComponent(FIRST_EXTRA_LIST_TITLE);
    this._moviesListMostCommented = new MoviesListExtraComponent(SECOND_EXTRA_LIST_TITLE);

    this._renderMoviesExtraBlock(SortType.RATING, TOP_RATED_BLOCK, this._moviesListTopRated);
    this._renderMoviesExtraBlock(COMMENTS_KEY, MOST_COMMENTED_BLOCK, this._moviesListMostCommented);
  }

  _rerenderMostCommentedBlock() {
    remove(this._moviesListMostCommented);
    this._renderMoviesExtraBlock(COMMENTS_KEY, MOST_COMMENTED_BLOCK, this._moviesListMostCommented);
  }

  _onDataChange(controller, newData, isComment = false) {

    this._api.updateMovie(newData.id, newData)
      .then((movieModel) => {

        const isSuccess = this._moviesModel.updateMovie(newData.id, movieModel);

        if (isSuccess) {
          controller.render(movieModel);

          if (this._showingMoviesCount % SHOWING_MOVIES_COUNT_BY_BUTTON === 0) {
            const destroyedMovie = this._showedMovieControllers.pop();
            destroyedMovie.destroy();
          }

          this._showedMovieControllers = [].concat(controller, this._showedMovieControllers);
          this._showingMoviesCount = this._showedMovieControllers.length;

          this._updateMovies(this._showingMoviesCount);
        }
      });

    if (isComment) {
      this._rerenderMostCommentedBlock();
    }
  }

  _updateMovies(count) {

    let movies = this._moviesModel.getMovies();
    this._removeMovies();

    if (this._activeSortType !== SortType.DEFAULT) {
      movies = getSortedMovies(movies, this._activeSortType, 0, movies.length);
    }

    this._renderMovies(movies.slice(0, count));
    this._renderLoadMoreButton();

    this._rerenderMoviesExtraBlocks();
  }

  _onViewChange() {
    this._showedMovieControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updateMovies(SHOWING_MOVIES_COUNT_ON_START);
    this._renderSorting();
  }

  _onSortTypeChange(sortType) {

    this._showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

    const movies = this._moviesModel.getMovies();

    this._activeSortType = sortType;

    this._renderSorting(sortType);

    const sortedMovies = getSortedMovies(movies, sortType, 0, this._showingMoviesCount);

    this._removeMovies();
    this._renderMovies(sortedMovies);

    this._renderLoadMoreButton();
  }

  show() {
    this._container.show();
  }

  hide() {
    this._container.hide();
  }
}
