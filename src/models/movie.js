export default class Movie {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`film_info`][`title`];
    this.originalTitle = data[`film_info`][`alternative_title`];
    this.rating = data[`film_info`][`total_rating`];
    this.director = data[`film_info`][`director`];
    this.writers = data[`film_info`][`writers`];
    this.actors = data[`film_info`][`actors`];
    this.date = data[`film_info`][`release`][`date`];
    this.country = data[`film_info`][`release`][`release_country`];
    this.year = data[`film_info`][`release`][`date`];
    this.duration = data[`film_info`][`runtime`];
    this.genre = data[`film_info`][`genre`];
    this.poster = data[`film_info`][`poster`];
    this.description = data[`film_info`][`description`];
    this.age = data[`film_info`][`age_rating`];
    this.comments = data[`comments`];
    this.watchingDate = data[`user_details`][`watching_date`];

    this.isWatchlist = Boolean(data[`user_details`][`watchlist`]);
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.isFavorite = Boolean(data[`user_details`][`favorite`]);
  }

  toRAW() {
    return {
      "id": this.id,
      "user_details": {
        "watchlist": this.isWatchlist,
        "already_watched": this.isWatched,
        "favorite": this.isFavorite,

        "watching_date": this.watchingDate,
      },

      "comments": this.comments,
      "film_info": {
        "title": this.title,
        "alternative_title": this.originalTitle,
        "total_rating": this.rating,
        "director": this.director,
        "writers": this.writers,
        "actors": this.actors,
        "runtime": this.duration,
        "genre": this.genre,
        "poster": this.poster,
        "description": this.description,
        "age_rating": this.age,
        "release": {
          "date": this.date,
          "release_country": this.country,
        },
      }
    };
  }

  static parseMovie(data) {
    return new Movie(data);
  }

  static parseMovies(data) {
    return data.map(Movie.parseMovie);
  }

  static clone(data) {
    return new Movie(data.toRAW());
  }
}
