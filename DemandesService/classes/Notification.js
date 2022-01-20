Request = require("../classes/Request");

module.exports = class Notification extends Request {
  constructor(data) {
    super();
    this.idUser = data.idUser;
    //is it important to use 
    this.idShop = data.idShop;
    this.idCategory = data.newCat;
    this.status = data.status;
    this._createdAt = data._createdAt;
    this.type = data.type;
    this.isRemoved = data.isRemoved;
  }
};
