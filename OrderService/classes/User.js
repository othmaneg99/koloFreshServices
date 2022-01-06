Request = require('../classes/Request')


module.exports =   class User extends Request{
    constructor(data){
        super()
        this.email = data.email;
        this.phone = data.phone;
        this.password = data.password;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.isActive = data.isActive;
        this.isVerified = data.isVerified;
        this.isRemoved = data.isRemoved;
        this.isReseted = data.isReseted;
    }
};