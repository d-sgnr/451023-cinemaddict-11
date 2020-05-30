import moment from 'moment';

import {
  ESC_KEYCODE,
  ENTER_KEYCODE
} from '../const.js';

export const formatDuration = (minutes) => {
  return moment.utc(moment.duration(minutes, `minutes`).asMilliseconds()).format(`h[h] m[m]`);
};

export const formatDate = (date, yearOnly) => {
  if (yearOnly === true) {
    return moment(date).format(`YYYY`);
  }
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatCommentDate = (date) => {
  return moment(date).fromNow();
};

export const getNowDate = () => {
  formatCommentDate(moment());
};

export const formatTime = (time) => {
  const hours = Math.floor(time / 60) + `h`;
  const minutes = time % 60 + `m`;
  const formattedTime = hours + ` ` + minutes;

  return formattedTime;
};

export const isEscKeyDown = (evt, action) => {
  return evt.keyCode === ESC_KEYCODE ? action() : ``;
};

export const isControlEnterKeyDown = (evt, action) => {
  return evt.keyCode === ENTER_KEYCODE && (evt.ctrlKey || evt.metaKey) ? action() : ``;
};

export const isEnterKeyDown = (evt, action) => {
  return evt.keyCode === ENTER_KEYCODE ? action() : ``;
};

export const makeWordCapitalized = (word) => {
  const string = word.slice(1);
  word = word[0].toUpperCase() + string;
  return word;
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

export const maybePluralize = (noun, number, suffix = `s`) => {
  const resultWord = `${noun}${number !== 1 ? suffix : ``}`;
  return resultWord;
};

export const makeArrayOfValues = (array, key) => {
  let newItems = [];

  array.forEach((arrayItem) => {
    newItems.push(arrayItem[key]);
  });

  return newItems;
};

export const getObjectWithMaxValue = (array, key) => {
  let maxValueObject = array.reduce((max, item) => max[key] > item[key] ? max : item);

  const index = array.indexOf(maxValueObject);

  const newItems = array.slice();

  newItems.splice(index, 1);

  const hasDuplicates = newItems.some((e) => e[key] === maxValueObject[key]);

  if (hasDuplicates) {
    return ``;
  }
  return maxValueObject;
};

export const sortArray = (property, asc = false) => {
  let sortOrder = 1;

  if (!asc) {
    sortOrder = -1;
  }

  return (a, b) => {
    let result = 0;

    if (a[property] < b[property]) {
      result = -1;
    } else if (a[property] > b[property]) {
      result = 1;
    }

    return result * sortOrder;
  };
};
