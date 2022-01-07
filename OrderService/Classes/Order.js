Request = require('../classes/Request')

module.exports =   class Order extends Request{
    constructor(data){
        super()
        this.numCommande = data.numCommande;
        this.dateHeureRecep = data.dateHeureRecep;
        this.listProduits = data.listProduits;
        this.isAccepted = data.isAccepted;
        this.status = data.status;
        this.idClient = data.idClient;
        this.idShop = data.idShop;
        this.dateHeureLivraison = data.dateHeureLivraison
        this.isRemoved = data.isRemoved;
    }
}