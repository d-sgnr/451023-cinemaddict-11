import {
  COMMENTS,
  AUTHORS,
  AVATARS
} from '../const.js';

import {
  getRandomItem
} from '../utils.js';

const generateComment = () => {
  const randomComment = getRandomItem(COMMENTS);
  const randomAuthor = getRandomItem(AUTHORS);
  const randomAvatar = getRandomItem(AVATARS);

  return {
    text: `${randomComment}`,
    author: `${randomAuthor}`,
    date: `22`,
    time: `22`,
    avatar: `./images/emoji/${randomAvatar}`,
  };
};

const generateComments = (qty) => {
  return new Array(qty).fill(``).map(generateComment);
};

export {
  generateComment
};
export {
  generateComments
};
