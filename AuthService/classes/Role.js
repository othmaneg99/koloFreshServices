Request = require('../classes/Request')

module.exports =   class Role extends Request{
    constructor(data){
        super()
        this.idUser = data.idUser;
        this.role = data.role;
        this.isRemoved = data.isRemoved;
    }
};