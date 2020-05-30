import AbstractComponent from './abstract-component.js';

import {
  RatingType,
  RatingMoviesCount
} from '../const.js';

export const getRank = (moviesCount) => {
  let rank = RatingType.LOW;

  switch (true) {
    case (moviesCount >= RatingMoviesCount.LOW && moviesCount <= RatingMoviesCount.MIDDLE):
      rank = RatingType.MIDDLE;
      break;
    case (moviesCount >= RatingMoviesCount.HIGH):
      rank = RatingType.HIGH;
      break;
  }
  return rank;
};

const createAvatarTemplate = (moviesCount) => {

  const userRank = getRank(moviesCount);

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class ProfileAvatar extends AbstractComponent {
  constructor(moviesModel) {
    super();

    this._moviesModel = moviesModel;
  }

  getTemplate() {
    const watchedMovies = this._moviesModel.getMoviesAll()
      .filter((movie) => movie.isWatched === true);

    if (watchedMovies.length > 0) {
      return createAvatarTemplate(watchedMovies.length);
    }
    return ``;
  }
}
