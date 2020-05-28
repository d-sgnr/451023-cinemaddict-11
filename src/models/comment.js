export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.date = data[`date`];
    this.avatar = data[`emotion`];
    this.text = data[`comment`];
  }

  toRAW() {
    return {
      "date": this.date,
      "emotion": this.avatar,
      "comment": this.text,
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }
}
