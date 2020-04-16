import {ESC_KEYCODE, ENTER_KEYCODE} from './const.js'

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const isEscKeyDown = (evt, action) => {
  evt.keyCode === ESC_KEYCODE ? action() : ``;
};

export const isEnterKeyDown = (evt, action) => {
  evt.keyCode === ENTER_KEYCODE ? action() : ``;
};

export const makeWordCapitalized = (word) => {
  const string = word.slice(1);
  return word = word[0].toUpperCase() + string;
};

export const getRandomItem = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

export const getRandomNumber = (min, max, decimal) => {
  let number = min + Math.random() * (max + 1 - min);

  decimal ? number = number.toFixed(1) : number = Math.floor(number);

  number > max ? number = max : number;

  return number;
};

export const insertSpacesIntoNumber = (number) => {
  const gapSize = 3;
  let formattedNumber = ``;
  let num = number.toString();
  while (num.length > 0) {
    formattedNumber = formattedNumber + ` ` + num.substring(0, gapSize);
    num = num.substring(gapSize);
  };
  return formattedNumber;
};

export const getRandomText = (text, min, max) => {
  const sentences = text.split(`.`).filter(Boolean);

  const qty = getRandomNumber(min, max);
  qty > sentences.length ? qty = sentences.length : qty;

  const array = [];

  for (let i = 0; i < qty; i++) {
    array.push(getRandomItem(sentences));
  };

  return array.join('. ') + `.`;
};

export const randomCommentsQty = () => {
  const commentsQty = getRandomNumber(MIN_COMMENTS_QTY, MAX_COMMENTS_QTY);
  if (commentsQty === 1) {
    return `${commentsQty} comment`;
  }
  return `${commentsQty} comments`;
};

export const maybePluralize = (noun, number, suffix = `s`) => {
  const resultWord = `${noun}${number !== 1 ? suffix : ``}`;
  return resultWord;
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};
