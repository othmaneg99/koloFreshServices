"use strict";
var nodemailer = require('nodemailer');
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

async function informerClient(idClient,numCommande, decisionCMD) {
    let user = new User({})
    let existUser = await user.get({_id : idClient, isRemoved : false})
    if(existUser){
        // envoi mail
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
            }
        });
        
        var mailOptions = {
            from: process.env.EMAIL,
            to: existUser[0].email,
            subject: `KOLO FRESH | Commande n° ${numCommande}`,
            text: `Bonjour ${existUser[0].lastName}, KOLO FRESH vous informe que ${decisionCMD}`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error)
            } else {
                console.log('Email sent')
            }
        });
    }
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
        let dataOrder = await orderData.get({_id : idOrder.insertedId, isRemoved : false})
        let dateRecep = dateHeureRecep.toLocaleString();
        await informerClient(req.body.idClient, idOrder.insertedId,`Votre commande de ${dateRecep} est bien reçue,  N° commande est ${idOrder.insertedId}, Merci pour votre confiance`)
        res.status(200).send(dataOrder)
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
                await informerClient(listOrders[i].idClient, listOrders[0]._id, `votre commande N° ${listOrders[i]._id} de ${dateRecep} n'a pas pu être traitée` );
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
