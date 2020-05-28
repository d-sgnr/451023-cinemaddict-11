import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';

import {
  getRank
} from '../components/profile-avatar.js';

import moment from 'moment';

import {
  HIDDEN_CLASS
} from '../const.js';

import {
  sortArray,
  makeWordCapitalized
} from '../utils/common.js';

const tabsStats = {
  ALL: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

const TABS_STATS = Object.values(tabsStats);

const createTabsMarkup = (tabs, currentTab) => {
  return tabs
    .map((tab) => {

      let tabName = makeWordCapitalized(tab);

      if (tabName === `All-time`) {
        tabName = `All time`;
      }

      return (
        `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${tab}" value="${tab}" ${currentTab === tab ? `checked` : ``}>
        <label for="statistic-${tab}" class="statistic__filters-label">${tabName}</label>`
      );
    }).join(`\n`);
};

const getGenresCount = (genres, genreName) => {
  return genres.reduce((total, x) => (x === genreName ? total + 1 : total), 0);
};

const getMoviesByPeriod = (movies, period) => {
  if (period === `all-time`) {
    return movies;
  } else {
    let moviesByPeriod = movies.filter((movie) => {
      const watchingDate = movie.watchingDate;
      return moment(watchingDate).isSame(new Date(), period);
    });
    return moviesByPeriod;
  }
};

const getObjectWithMaxValue = (array, key) => {
  let maxValueObject = array.reduce((max, item) => max[key] > item[key] ? max : item);

  const index = array.indexOf(maxValueObject);

  const newArray = array.slice();

  newArray.splice(index, 1);

  const hasDuplicates = newArray.some((e) => e[key] === maxValueObject[key]);

  if (hasDuplicates) {
    return ``;
  }
  return maxValueObject;
};

const getAllGenres = (movies) => {
  let genresArray = [];

  movies.map((movie) => {
    genresArray.push(...movie.genre);
  });

  const uniqueGenres = [...new Set(genresArray)];

  const genresObjects = uniqueGenres.map((genre) => {
    return {
      genre,
      count: getGenresCount(genresArray, genre),
    };
  });

  return genresObjects.sort(sortArray(`count`));
};

const makeArrayOfValues = (array, key) => {
  let newArray = [];

  array.forEach((arrayItem) => {
    newArray.push(arrayItem[key]);
  });

  return newArray;
};

const renderGenresChart = (statisticCtx, movies, period) => {

  const moviesToShow = getMoviesByPeriod(movies, period);

  const allGenres = getAllGenres(moviesToShow);

  const genres = makeArrayOfValues(allGenres, `genre`);

  const genresCounts = makeArrayOfValues(allGenres, `count`);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: genresCounts,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticsTemplate = ({
  movies,
  period
}) => {

  const filteredMovies = getMoviesByPeriod(movies, period);

  const allGenres = getAllGenres(filteredMovies);

  const getTotalTime = (moviesToCount, minutes = false) => {

    let totalTime = 0;

    moviesToCount.map((movie) => {
      totalTime += movie.duration;
    });

    const totalHours = Math.floor(totalTime / 60);
    const totalMinutes = totalTime % 60;

    if (minutes) {
      return totalMinutes;
    }
    return totalHours;
  };

  const hours = getTotalTime(filteredMovies);
  const minutes = getTotalTime(filteredMovies, true);

  const moviesCount = filteredMovies.length;

  const isTopGenre = (genres) => {

    if (genres.length > 0) {
      const topGenre = getObjectWithMaxValue(genres, `count`);

      if (topGenre) {
        return topGenre[`genre`];
      }

      return `-`;
    }

    return `-`;
  };

  const topGenre = isTopGenre(allGenres);

  // const watchedMovies = movies.filter((movie) => movie.isWatched === true);

  const userRank = getRank(movies.length);

  const tabsMarkup = createTabsMarkup(TABS_STATS, period);

  return (
    `<section class="statistic visually-hidden">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${userRank}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${tabsMarkup}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${moviesCount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`
  );
};

export default class Stats extends AbstractSmartComponent {
  constructor(moviesModel) {
    super();

    this._movies = moviesModel;
    this._statsChart = null;

    this._period = `all-time`;

    this._renderCharts();

    this.setFilterChangeHandler();
  }

  getTemplate() {

    const watchedMovies = this._movies.getMovies().filter((movie) => movie.isWatched === true);

    return createStatisticsTemplate({
      movies: watchedMovies,
      period: this._period,
    });
  }

  recoveryListeners() {
    this.setFilterChangeHandler();
  }

  _renderCharts() {
    const element = this.getElement();

    const statisticCtx = element.querySelector(`.statistic__chart`);

    this._resetCharts();

    const watchedMovies = this._movies.getMovies().filter((movie) => movie.isWatched === true);

    this._statsChart = renderGenresChart(statisticCtx, watchedMovies, this._period);
  }

  _resetCharts() {
    if (this._statsChart) {
      this._statsChart.destroy();
      this._statsChart = null;
    }
  }

  rerender(movies, period) {
    this._movies = movies;
    this._period = period;

    super.rerender();

    this.show();

    this._renderCharts();
  }

  setMovies(movies) {
    this._movies = Array.from(movies);
    // this._callHandlers(this._dataChangeHandlers);
  }

  setFilterChangeHandler() {
    const periodButtons = this.getElement().querySelectorAll(`.statistic__filters-label`);

    periodButtons.forEach((button) => {
      button.addEventListener(`click`, (evt) => {

        const periodName = evt.target.previousElementSibling.value;

        this._period = periodName;

        this.rerender(this._movies, this._period);
      });
    });
  }

  show() {
    super.show();

    // this.rerender(this._movies, this._period);
    // document.querySelector(`.statistic`).classList.remove(HIDDEN_CLASS);
    //
    // this.rerender(this._movies);
  }

  hide() {
    document.querySelector(`.statistic`).classList.add(HIDDEN_CLASS);
  }
}
