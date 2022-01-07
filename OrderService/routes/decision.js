"use strict";
const date = require('date-and-time')
var express = require('express');
var Order = require('../classes/Order')
var User = require('../classes/User')
var envoiEmail = require('./envoiEmail.js')
var router = express.Router();

require('dotenv').config()


router.post("/accepter", async function (req,res,next) {
    if(req.body.numCommande){
        let order = new Order({isAccepted : true, status : 'pending'})
        await order.update({numCommande : req.body.numCommande, isRemoved : false})
        let dataOrder = await order.get({numCommande : req.body.numCommande, isRemoved : false})
        if(dataOrder.length !=0){
            let dateHeureRecep = new Date(dataOrder[0].dateHeureRecep);
            let dateRecep = dateHeureRecep.toLocaleString();
            let user = new User({})
            let existUser = await user.get({_id : dataOrder[0].idClient, isRemoved : false})
            if(existUser.length!=0){
                await new envoiEmail({nomClient : existUser[0].lastName+" "+existUser[0].firstName, emailClient : existUser[0].email, numCommande : dataOrder[0]._id, decisionCMD : `votre commande N° ${dataOrder[0]._id}  de ${dateRecep} est en cours de préparation`})
                res.status(200).send("DONE");
            }
        }else{
            res.status(401).send("CETTE COMMANDE N'EXISTE PAS")
        }
    }else{
        res.status(401).send("MERCI DE DONNER LE NUM DE COMMANDE")
    }
})

router.post("/refuser", async function (req,res,next) {
    if(req.body.numCommande){
        let order = new Order({isAccepted : false})
        await order.update({numCommande : req.body.numCommande, isRemoved : false})
        let dataOrder = await order.get({numCommande : req.body.numCommande, isRemoved : false})
        if(dataOrder.length !=0){
            let dateHeureRecep = new Date(dataOrder[0].dateHeureRecep);
            let dateRecep = dateHeureRecep.toLocaleString();
            let user = new User({})
            let existUser = await user.get({_id : dataOrder[0].idClient, isRemoved : false})
            if(existUser.length!=0){
                await new envoiEmail({nomClient : existUser[0].lastName+" "+existUser[0].firstName, emailClient : existUser[0].email, numCommande : dataOrder[0]._id, decisionCMD : `votre commande N° ${dataOrder[0]._id}  de ${dateRecep}  n'a pas pu être traitée`})
                res.status(200).send("DONE");
            }
        }else{
            res.status(401).send("CETTE COMMANDE N'EXISTE PAS")
        }
    }else{
        res.status(401).send("MERCI DE DONNER LE NUM DE COMMANDE")
    }
})

router.post("/done", async function (req,res,next) {
    if(req.body.numCommande){
        let now = new Date();
        let dateHeureLivraison = date.addHours(now,1);
        let order = new Order({status : 'done', dateHeureLivraison : dateHeureLivraison})
        await order.update({numCommande : req.body.numCommande, isRemoved : false})
        let dataOrder = await order.get({numCommande : req.body.numCommande, isRemoved : false})
        if(dataOrder.length !=0){
            let dateHeureRecep = new Date(dataOrder[0].dateHeureRecep);
            let dateRecep = dateHeureRecep.toLocaleString();
            let user = new User({})
            let existUser = await user.get({_id : dataOrder[0].idClient, isRemoved : false})
            if(existUser.length!=0){
                await new envoiEmail({nomClient : existUser[0].lastName+" "+existUser[0].firstName, emailClient : existUser[0].email, numCommande : dataOrder[0]._id, decisionCMD : `votre commande N° ${dataOrder[0]._id}  de ${dateRecep} est prête. bon appétit 😋.`})
                res.status(200).send("DONE");
            }
        }else{
            res.status(401).send("CETTE COMMANDE N'EXISTE PAS")
        }
    }else{
        res.status(401).send("MERCI DE DONNER LE NUM DE COMMANDE")
    }
})

module.exports = router;
