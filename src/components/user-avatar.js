const createUserAvatarTemplate = (avatar) => {
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

export {
  createUserAvatarTemplate
};
