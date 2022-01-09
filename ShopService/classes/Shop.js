Request =  require('../classes/Request')
module.exports =   class Shop extends Request{
    constructor(data){
        super()
        this.name=data.name;
        this.description=data.description;
        this.status=data.status;
        this.idCateg=data.idCateg;
        this.idUser=data.idUser;
        this.isRemoved = data.isRemoved;
        this._createdAt = data._createdAt;
        this._updatedAt = data._updatedAt;
    }
}