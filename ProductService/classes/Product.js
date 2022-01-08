Request = require('../classes/Request')

module.exports =   class Product extends Request{
    constructor(data){
        super()
        this.name=data.name;
        this.description=data.description;
        this.price=data.price;
        this.idCateg=data.idCateg;
        this.isActivated=data.isActivated;
        this.idShop=data.idShop
        this.isRemoved = data.isRemoved;
    }
};