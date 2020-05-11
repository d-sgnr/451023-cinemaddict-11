import AbstractComponent from './abstract-component.js';

const getRank = (moviesCount) => {
  let rank = `Novice`;

  switch (true) {
    case (moviesCount >= 11 && moviesCount <= 20):
      rank = `Fan`;
      break;
    case (moviesCount >= 21):
      rank = `Movie Buff`;
      break;
  } return rank;
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
    } return ``;
  }
}
