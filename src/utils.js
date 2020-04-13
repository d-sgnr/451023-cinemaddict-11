const makeWordCapitalized = (word) => {
  const string = word.slice(1);
  return word = word[0].toUpperCase() + string;
};

const getRandomItem = (items) => {
  return items[Math.floor(Math.random() * items.length)];
};

const getRandomNumber = (min, max, decimal) => {
  let number = min + Math.random() * (max + 1 - min);

  decimal ? number = number.toFixed(1) : number = Math.floor(number);

  number > max ? number = max : number;

  return number;
};

const insertSpacesIntoNumber = (number) => {
  const gapSize = 3;
  let formattedNumber = ``;
  let num = number.toString();
  while (num.length > 0) {
    formattedNumber = formattedNumber + ` ` + num.substring(0, gapSize);
    num = num.substring(gapSize);
  };
  return formattedNumber;
};

const getRandomText = (text, min, max) => {
  const sentences = text.split(`.`).filter(Boolean);

  const qty = getRandomNumber(min, max);
  qty > sentences.length ? qty = sentences.length : qty;

  const array = [];

  for (let i = 0; i < qty; i++) {
    array.push(getRandomItem(sentences));
  };

  return array.join('. ') + `.`;
};

const randomCommentsQty = () => {
  const commentsQty = getRandomNumber(MIN_COMMENTS_QTY, MAX_COMMENTS_QTY);
  if (commentsQty === 1) {
    return `${commentsQty} comment`;
  }
  return `${commentsQty} comments`;
};

const maybePluralize = (noun, number, suffix = `s`) => {
  const resultWord = `${noun}${number !== 1 ? suffix : ``}`;
  return resultWord;
};

export {
  makeWordCapitalized,
  getRandomItem,
  getRandomText,
  getRandomNumber,
  insertSpacesIntoNumber,
  maybePluralize
};
