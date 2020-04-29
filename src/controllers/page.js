import MoviesListComponent from '../components/movies-list.js';
import MoviesListContainerComponent from '../components/movies-list-container.js';
import MoviesListExtraComponent from '../components/movies-list-extra.js';

import LoadMoreButtonComponent from '../components/load-more-button.js';
import SortComponent, {
  SortType
} from '../components/sort.js';
import NoMoviesComponent from '../components/no-movies.js';

import MovieController from '../controllers/movie.js';

import {
  sortArray
} from '../utils/common.js';
import {
  render,
  remove,
  RenderPosition
} from '../utils/render.js';

import {
  SHOWING_MOVIES_COUNT_ON_START,
  SHOWING_MOVIES_COUNT_BY_BUTTON,
  MOVIES_COUNT_EXTRA,
  TOP_RATED_BLOCK,
  MOST_COMMENTED_BLOCK,
  FIRST_EXTRA_LIST_TITLE,
  SECOND_EXTRA_LIST_TITLE
} from '../const.js';

const renderMovies = (moviesListElement, movies, onDataChange, onViewChange) => {
  return movies.map((movie) => {
    const movieController = new MovieController(moviesListElement, onDataChange, onViewChange);
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
    case SortType.COMMENTS:
      sortedMovies = showingMovies.sort(sortArray(`commentsQty`));
      break;
    case SortType.DEFAULT:
      sortedMovies = showingMovies;
      break;
  }

  return sortedMovies.slice(from, to);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._movies = [];
    this._showedMoviesControllers = [];

    this._showingMoviesCountOnStart = SHOWING_MOVIES_COUNT_ON_START;

    this._noMoviesComponent = new NoMoviesComponent();
    this._sortComponent = new SortComponent();

    this._moviesListComponent = new MoviesListComponent();
    this._moviesListContainerComponent = new MoviesListContainerComponent();

    this._moviesListExtraTopRatedComponent = new MoviesListExtraComponent(FIRST_EXTRA_LIST_TITLE);
    this._moviesListExtraMostCommentedComponent = new MoviesListExtraComponent(SECOND_EXTRA_LIST_TITLE);

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(movies) {
    this._movies = movies;

    if (this._movies.length === 0) {
      render(this._container.getElement(), this._noMoviesComponent);
      return;
    }

    const container = this._container;
    const moviesListElement = this._moviesListComponent.getElement();
    const moviesToShow = this._movies.slice(0, this._showingMoviesCountOnStart);

    // SORT

    render(container.getElement(), this._sortComponent, RenderPosition.AFTERBEGIN);

    // MOVIES

    render(container.getElement(), this._moviesListContainerComponent);

    render(this._moviesListContainerComponent.getElement(), this._moviesListComponent);

    const newMovies = renderMovies(moviesListElement, moviesToShow, this._onDataChange, this._onViewChange);

    this._showedMoviesControllers = this._showedMoviesControllers.concat(newMovies);

    this._renderLoadMoreButton();

    // MOVIES-EXTRA

    this._renderMoviesExtraBlock(SortType.RATING, TOP_RATED_BLOCK, this._moviesListExtraTopRatedComponent);
    this._renderMoviesExtraBlock(SortType.COMMENTS, MOST_COMMENTED_BLOCK, this._moviesListExtraMostCommentedComponent);
  }

  _renderLoadMoreButton() {
    const moviesListElement = this._moviesListComponent.getElement();

    if (this._showingMoviesCountOnStart >= this._movies.length) {
      return;
    }

    render(this._moviesListContainerComponent.getElement(), this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevMoviesCount = this._showingMoviesCountOnStart;
      this._showingMoviesCountOnStart = this._showingMoviesCountOnStart + SHOWING_MOVIES_COUNT_BY_BUTTON;

      const moviesToShow = this._movies.slice(prevMoviesCount, this._showingMoviesCountOnStart);

      const newMovies = renderMovies(moviesListElement, moviesToShow, this._onDataChange, this._onViewChange);

      this._showedMoviesControllers = this._showedMoviesControllers.concat(newMovies);

      if (this._showingMoviesCountOnStart >= this._movies.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  _renderMoviesExtraBlock(sortType, block, component) {
    render(this._container.getElement(), component);

    const moviesExtraContainer = this._container.getElement().querySelectorAll(`.films-list--extra .films-list__container`)[block];

    const extraMovies = getSortedMovies(this._movies, sortType, 0, MOVIES_COUNT_EXTRA);

    const newMovies = renderMovies(moviesExtraContainer, extraMovies, this._onDataChange, this._onViewChange);

    this._showedMoviesControllers = this._showedMoviesControllers.concat(newMovies);
  }

  _onDataChange(oldData, newData) {
    const index = this._movies.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._movies = [].concat(this._movies.slice(0, index), newData, this._movies.slice(index + 1));

    this._showedMoviesControllers[index].render(this._movies[index]);
  }

  _onViewChange() {
    this._showedMoviesControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const moviesListElement = this._moviesListComponent.getElement();

    const sortedMovies = getSortedMovies(this._movies, sortType, 0, this._showingMoviesCountOnStart);

    moviesListElement.innerHTML = ``;

    const newMovies = renderMovies(moviesListElement, sortedMovies, this._onDataChange, this._onViewChange);

    this._showedMoviesControllers = this._showedMoviesControllers.concat(newMovies);

    this._renderLoadMoreButton();
  }
}
