import AbstractComponent from "./abstract-component.js";

// В случае добавления пунктов меню, просто добавить их в MenuItem, они отрендерятся автоматически

export const MenuItem = {
  STATS: `Stats`,
};

const createMenuItemMarkup = (menuItem, isActive) => {
  const {
    name
  } = menuItem;

  const menuLink = name.toLowerCase();

  return (
    `<a href="#${menuLink}" class="main-navigation__additional ${isActive ? `main-navigation__additional--active` : ``}">${name}</a>`
  );
};

const createSiteMenuTemplate = (menuItems) => {
  const menuItemsMarkup = menuItems.map((it) => createMenuItemMarkup(it, it.active)).join(``);
  return (
    `<nav class="main-navigation">
      ${menuItemsMarkup}
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  constructor() {
    super();

    this._menuItems = this._generateMenu(this._activeMenuItem);
  }

  recoveryListeners() {
    this.setActiveItem(this._activeItemHandler);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._menuItems);
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {

      if (evt.target.tagName !== `A` && evt.target.tagName !== `SPAN`) {
        return;
      }

      const menuItems = this.getElement().querySelectorAll(`.main-navigation__additional`);

      menuItems.forEach((it) => {
        it.classList.remove(`main-navigation__additional--active`);
      });

      evt.target.classList.add(`main-navigation__additional--active`);

      const activeItem = evt.target.textContent;

      handler(activeItem);
    });
  }

  _generateMenu(activeMenuItem) {
    if (activeMenuItem) {
      return false;
    }
    return Object.values(MenuItem).map((menuItem) => {
      return {
        name: menuItem,
        active: menuItem === activeMenuItem,
      };
    });
  }
}
