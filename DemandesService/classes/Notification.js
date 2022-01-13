Request = require("../classes/Request");

module.exports = class Notification extends Request {
  constructor(data) {
    super();
    this.idUser = data.idUser;
    this.idShop = data.idShop;
    this.status = data.status;
    this._createdAt = data._createdAt;
    this.type = data.type;
    this.isRemoved = data.isRemoved;
  }
};
