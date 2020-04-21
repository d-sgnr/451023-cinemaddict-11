import CommentComponent from '../components/comment.js';
import LoadMoreButtonComponent from '../components/load-more-button.js';
import MoviePopupComponent from '../components/movie-popup.js';
import MovieComponent from '../components/movie.js';
import MoviesListComponent from '../components/movies-list.js';
import MoviesListExtraComponent from '../components/movies-list-extra.js';
import SortComponent, {SortType} from '../components/sort.js';
import NoMoviesComponent from '../components/no-movies.js';

import {
  generateComments
} from '../mocks/comments.js';
import {
  isEscKeyDown,
  sortArray
} from '../utils/common.js';
import {
  render,
  remove
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

const renderMovie = (moviesListElement, movie) => {

  const siteBodyElement = document.querySelector(`body`);
  const movieComponent = new MovieComponent(movie);

  render(moviesListElement, movieComponent);

  // POPUP

  const renderMoviePopup = () => {
    const moviePopupComponent = new MoviePopupComponent(movie);

    render(siteBodyElement, moviePopupComponent);

    // POPUP-CLOSE

    const closeMoviePopup = () => {
      document.removeEventListener(`keydown`, onEscKeyDownPopupClose);
      remove(moviePopupComponent);
    };

    const onEscKeyDownPopupClose = (evt) => {
      isEscKeyDown(evt, closeMoviePopup);
    };

    moviePopupComponent.setMoviePopupCloseClickHandler(closeMoviePopup);

    document.addEventListener(`keydown`, onEscKeyDownPopupClose);

    // COMMENTS

    const comments = generateComments(movie.commentsQty);

    const commentsListPopupElement = document.querySelector(`.film-details__comments-list`);

    for (let i = 0; i < movie.commentsQty; i++) {
      render(commentsListPopupElement, new CommentComponent(comments[i]));
    }
  };

  // POPUP-OPEN

  movieComponent.setMovieCardClickHandler(() => {
    renderMoviePopup(movie);
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
    case SortType.DEFAULT:
      sortedMovies = showingMovies;
      break;
  }

  return sortedMovies.slice(from, to);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._noMoviesComponent = new NoMoviesComponent();
    this._sortComponent = new SortComponent();
    this._moviesListComponent = new MoviesListComponent();
    this._moviesListExtraTopRatedComponent = new MoviesListExtraComponent(FIRST_EXTRA_LIST_TITLE);
    this._moviesListExtraMostCommentedComponent = new MoviesListExtraComponent(SECOND_EXTRA_LIST_TITLE);
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(movies) {
    const container = this._container;
    const moviesMainContainerElement = this._moviesListComponent.getElement();

    // SORT

    render(container.getElement(), this._sortComponent);

    // LOAD-MORE-BUTTON

    const renderLoadMoreButton = () => {
      if (showingMoviesCount >= movies.length) {
        return;
      }

      render(moviesMainContainerElement, this._loadMoreButtonComponent);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevMoviesCount = showingMoviesCount;
        showingMoviesCount = showingMoviesCount + SHOWING_MOVIES_COUNT_BY_BUTTON;

        movies.slice(prevMoviesCount, showingMoviesCount)
          .forEach((movie) => renderMovie(moviesListElement, movie));

        if (showingMoviesCount >= movies.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    };

    render(container.getElement(), this._moviesListComponent);

    if (movies.length === 0) {
      render(moviesMainContainerElement, this._noMoviesComponent);
      return;
    }

    // MOVIES

    const moviesListElement = this._moviesListComponent.getElement().querySelector(`.films-list__container`);

    let showingMoviesCount = SHOWING_MOVIES_COUNT_ON_START;

    movies.slice(0, showingMoviesCount)
      .forEach((movie) => {
        renderMovie(moviesListElement, movie);
      });

    // MOVIES-EXTRA

    render(container.getElement(), this._moviesListExtraTopRatedComponent);
    render(container.getElement(), this._moviesListExtraMostCommentedComponent);

    const moviesTopRatedBlock = container.getElement().querySelectorAll(`.films-list--extra .films-list__container`)[TOP_RATED_BLOCK];

    const moviesMostCommentedBlock = container.getElement().querySelectorAll(`.films-list--extra .films-list__container`)[MOST_COMMENTED_BLOCK];

    const topRatedMovies = movies.slice();

    topRatedMovies.sort(sortArray(`rating`));

    topRatedMovies.slice(0, MOVIES_COUNT_EXTRA)
      .forEach((movie) => {
        renderMovie(moviesTopRatedBlock, movie);
      });

    const mostCommentedMovies = movies.slice();

    mostCommentedMovies.sort(sortArray(`commentsQty`));

    mostCommentedMovies.slice(0, MOVIES_COUNT_EXTRA)
      .forEach((movie) => {
        renderMovie(moviesMostCommentedBlock, movie);
      });

    // Sort

    renderLoadMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {

      showingMoviesCount = SHOWING_MOVIES_COUNT_BY_BUTTON;

      const sortedMovies = getSortedMovies(movies, sortType, 0, showingMoviesCount);

      moviesListElement.innerHTML = ``;

      sortedMovies.slice(0, showingMoviesCount)
        .forEach((movie) => {
          renderMovie(moviesListElement, movie);
        });

      renderLoadMoreButton();
    });
  }
}
