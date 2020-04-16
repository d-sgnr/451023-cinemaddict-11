import {
  createElement
} from '../utils.js';

const createAvatarTemplate = (avatar) => {
  const {
    rating,
    icon
  } = avatar;

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="images/${icon}" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class ProfileAvatar {
  constructor(avatar) {
    this._avatar = avatar;

    this._element = null;
  }

  getTemplate() {
    return createAvatarTemplate(this._avatar);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
