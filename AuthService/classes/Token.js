Request = require('../classes/Request')

module.exports =   class Token extends Request{
    constructor(data){
        super()
        this.idUser = data.idUser;
        this.token = data.token;
        this.isRemoved = data.isRemoved;
    }
};