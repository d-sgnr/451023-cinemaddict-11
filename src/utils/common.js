import {
  ESC_KEYCODE,
  ENTER_KEYCODE,
  MIN_COMMENTS_QTY,
  MAX_COMMENTS_QTY
} from '../const.js';

export const isEscKeyDown = (evt, action) => {
  return evt.keyCode === ESC_KEYCODE ? action() : ``;
};

export const isEnterKeyDown = (evt, action) => {
  return evt.keyCode === ENTER_KEYCODE ? action() : ``;
};

export const makeWordCapitalized = (word) => {
  const string = word.slice(1);
  word = word[0].toUpperCase() + string;
  return word;
};

export const getRandomItem = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

export const getRandomNumber = (min, max, decimal = false) => {
  let number = min + Math.random() * (max + 1 - min);

  if (decimal === true) {
    number = number.toFixed(1);
  } else {
    number = Math.floor(number);
  }

  if (number > max) {
    number = max;
  }

  return number;
};

export const insertSpacesIntoNumber = (number) => {
  const gapSize = 3;
  let formattedNumber = ``;
  let num = number.toString();
  while (num.length > 0) {
    formattedNumber = formattedNumber + ` ` + num.substring(0, gapSize);
    num = num.substring(gapSize);
  }
  return formattedNumber;
};

export const getRandomText = (text, min, max) => {
  const sentences = text.split(`.`).filter(Boolean);

  const qty = getRandomNumber(min, max);
  if (qty > sentences.length) {
    qty = sentences.length;
  }

  const array = [];

  for (let i = 0; i < qty; i++) {
    array.push(getRandomItem(sentences));
  }

  return array.join(`. `) + `.`;
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

export const sortArray = (property, asc = false) => {
  let sortOrder = 1;

  if (!asc) {
    sortOrder = -1;
  }

  return function (a, b) {
    let result = 0;

    if (a[property] < b[property]) {
      result = -1;
    } else if (a[property] > b[property]) {
      result = 1;
    }

    return result * sortOrder;
  };
};
