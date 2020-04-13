import {
  RATINGS
} from '../const.js';
import {
  getRandomItem,
  makeWordCapitalized
} from '../utils.js';

const generateAvatar = () => {
  const randomRating = makeWordCapitalized(getRandomItem(RATINGS));

  return {
    rating: `${randomRating}`,
    icon: `bitmap@2x.png`,
  };
};

export {
  generateAvatar
};
