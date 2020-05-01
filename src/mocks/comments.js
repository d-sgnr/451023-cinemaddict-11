import {
  COMMENTS,
  AUTHORS,
  AVATARS
} from '../const.js';

import {
  getRandomDate,
  getRandomItem
} from '../utils/common.js';

const commentDate = getRandomDate();

export const generateComment = () => {
  const randomComment = getRandomItem(COMMENTS);
  const randomAuthor = getRandomItem(AUTHORS);
  const randomAvatar = getRandomItem(AVATARS);

  return {
    text: `${randomComment}`,
    author: `${randomAuthor}`,
    date: commentDate,
    avatar: `./images/emoji/${randomAvatar}`,
  };
};

export const generateComments = (qty) => {
  return new Array(qty).fill(``).map(generateComment);
};
