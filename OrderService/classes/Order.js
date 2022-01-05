Request = require('../classes/Request')

module.exports =   class Order extends Request{
    constructor(data){
        super()
        this.numCommande = data.numCommande;
        this.dateHeureRecep = data.dateHeureRecep;
        this.listProduits = data.listProduits;
        this.isAccepted = data.isAccepted;
        this.satatus = data.satatus;
        this.idClient = data.idClient;
        this.idShop = data.idShop;
        this.isRemoved = data.isRemoved;
    }
};