Request = require("../classes/Request");
module.exports = class Categorie extends Request {
  constructor(data) {
    super();
    this._id = data._id;
    this.name = data.name;
    this.isRemoved = data.isRemoved;
  }
};
