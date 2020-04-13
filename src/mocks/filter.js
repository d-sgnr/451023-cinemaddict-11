import {
  FILTERS_NAMES
} from '../const.js';

const generateFilters = () => {
  return FILTERS_NAMES.map((it) => {
    return {
      name: it,
      qty: Math.floor(Math.random() * 10)
    };
  });
};

export {
  generateFilters
};
