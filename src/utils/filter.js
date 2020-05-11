import {FilterType} from '../const.js';

export const getWatchlistMovies = (movies) => {
  return movies.filter((movie) => movie.isWatchlist);
};

export const getWatchedMovies = (movies) => {
  return movies.filter((movie) => movie.isWatched);
};

export const getFavoritesMovies = (movies) => {
  return movies.filter((movie) => movie.isFavorite);
};

export const getMoviesByFilter = (movies, filterType) => {

  switch (filterType) {
    case FilterType.ALL:
      return movies;
    case FilterType.WATCHLIST:
      return getWatchlistMovies(movies);
    case FilterType.HISTORY:
      return getWatchedMovies(movies);
    case FilterType.FAVORITES:
      return getFavoritesMovies(movies);
  }

  return movies;
};
