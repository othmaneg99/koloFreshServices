"use strict";
const date = require('date-and-time')
var express = require('express');
var Order = require('../classes/Order')
var User = require('../classes/User')
var router = express.Router();
require('dotenv').config()

function checkTime(dateHeureRecep) {
    let dateRecep = new Date(dateHeureRecep);
    let now = new Date();
    let dateNow = date.addHours(now,1);
    let diff = Math.abs(dateRecep.getTime() - dateNow.getTime()) / 3600000; // return nb hours
    console.log(diff)
    if (diff < 1) { return true }
    return false
}


/* Add Order */
router.post('/', async function(req,res, next) {
    if(req.body.listProduits && req.body.idClient && req.body.idShop){
        let order = new Order({})
        let lastOrder = await order.getLastOne({})
        let numCommande
        if(lastOrder.length!=0){
            numCommande = lastOrder[0].numCommande +1;
        }else{
            numCommande = 1;
        }
        const now = new Date();
        const dateHeureRecep = date.addHours(now,1); // UTC+01:00
        let orderData = new Order({
            numCommande : numCommande,
            dateHeureRecep : dateHeureRecep,
            listProduits : req.body.listProduits,
            isAccepted : true,
            status : 'new',
            idClient : req.body.idClient,
            idShop : req.body.idShop,
            isRemoved : false
        })
        let idOrder = await orderData.post();
        //let dataOrder = await orderData.get({_id : idOrder.insertedId, isRemoved : false})
        let dateRecep = dateHeureRecep.toLocaleString();
        let user = new User({})
        let existUser = await user.get({_id : req.body.idClient, isRemoved : false})
        if(existUser.length!=0){
                await new envoiEmail({nomClient : existUser[0].lastName+" "+existUser[0].firstName, emailClient : existUser[0].email, numCommande : idOrder.insertedId, decisionCMD : `Votre commande de ${dateRecep} est bien reçue ✔✔ ,  N° commande est ${idOrder.insertedId}, Merci pour votre confiance 🤗.`})
                res.status(200).send("DONE");
        }
        orderData._id = idOrder.insertedId
        res.status(200).send(orderData)
    }else{
        res.status(401).send("MERCI DE REMPLIR TOUS LES CHAMPS.")
    }
})
/* GET new orders. */
router.get('/new', async function(req, res, next) {
    let order = new Order({})
    let listOrders = await order.get({idShop : req.query.idShop, status : 'new', isRemoved : false});
    let newListOrders = [];
    for (let i = 0; i < listOrders.length; i++) {
        let dateHeureRecep = new Date(listOrders[i].dateHeureRecep);
        if(checkTime(dateHeureRecep)){
            newListOrders.push(listOrders[i])
        }else{
            if(listOrders[i].isAccepted){
                let dateRecep = dateHeureRecep.toLocaleString();
                let user = new User({})
                let existUser = await user.get({_id : dataOrder[0].idClient, isRemoved : false})
                if(existUser.length!=0){
                    await new envoiEmail({nomClient : existUser[0].lastName+" "+existUser[0].firstName, emailClient : existUser[0].email, numCommande : dataOrder[0]._id, decisionCMD : `votre commande N° ${dataOrder[0]._id}  de ${dateRecep}  n'a pas pu être traitée`})
                    res.status(200).send("DONE");
                }
                let newOrder = new Order({isAccepted : false})
                await newOrder.update({_id : listOrders[i]._id})
            }
        }
    }
    res.status(200).send(newListOrders)
});


/* GET pending orders. */
router.get('/pending', async function(req, res, next) {
    let order = new Order({})
    let listOrders = await order.get({idShop : req.query.idShop, status : 'pending', isRemoved : false});
    res.status(200).send(listOrders)
});

/* GET done orders. */
router.get('/done', async function(req, res, next) {
    let order = new Order({})
    let listOrders = await order.get({idShop : req.query.idShop, status : 'done', isRemoved : false});
    res.status(200).send(listOrders)
});

module.exports = router;
