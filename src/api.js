import Movie from "./models/movie.js";
import Comment from "./models/comment.js";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const API = class {
  constructor(endPoint, authorization) {

    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovie(id) {
    return this._load({
        url: `movies/${id}`
      })

      .then((response) => response.json())
      .then(Movie.parseMovie);
  }

  getMovies() {
    return this._load({
        url: `movies`
      })

      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  getComments(id) {
    return this._load({
        url: `comments/${id}`
      })

      .then((response) => response.json())
      .then(Comment.parseComments);
  }

  updateMovie(id, data) {

    return this._load({
        url: `movies/${id}`,
        method: Method.PUT,
        body: JSON.stringify(data.toRAW()),
        headers: new Headers({
          "Content-Type": `application/json`
        })
      })
      .then((response) => response.json())
      .then(Movie.parseMovie);
  }

  createComment(comment, id) {
    return this._load({
        url: `comments/${id}`,
        method: Method.POST,
        body: JSON.stringify(comment.toRAW()),
        headers: new Headers({
          "Content-Type": `application/json`
        })
      })
      .then((response) => response.json())
      .then(Comment.parseComment);
  }

  deleteComment(id) {
    return this._load({
      url: `comments/${id}`,
      method: Method.DELETE
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {
        method,
        body,
        headers
      })
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
