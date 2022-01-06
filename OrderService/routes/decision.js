"use strict";
var nodemailer = require('nodemailer');
const date = require('date-and-time')
var express = require('express');
var Order = require('../classes/Order')
var User = require('../classes/User')
var router = express.Router();
require('dotenv').config()


async function informerClient(idClient, numCommande,decisionCMD) {
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
            subject: `KOLO FRESH | La commande N° ${numCommande}`,
            text: `Bonjour ${existUser[0].lastName}, KOLO FRESH vous informe que ${decisionCMD}`
        };
        
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error)
                return error
            } else {
                console.log('Email sent')
                return 'Email sent'
            }
        });
    }
}

router.post("/accepter", async function (req,res,next) {
    if(req.body.numCommande){
        let order = new Order({isAccepted : true, status : 'pending'})
        await order.update({numCommande : req.body.numCommande, isRemoved : false})
        let dataOrder = await order.get({numCommande : req.body.numCommande, isRemoved : false})
        if(dataOrder.length !=0){
            let dateHeureRecep = new Date(dataOrder[0].dateHeureRecep);
            let dateRecep = dateHeureRecep.toLocaleString();
            await informerClient(dataOrder[0].idClient, dataOrder[0]._id,  `votre commande N° ${dataOrder[0]._id}  de ${dateRecep} est en cours de préparation`)
            res.status(200).send("DONE");
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
            await informerClient(dataOrder[0].idClient, dataOrder[0]._id,  `votre commande N° ${dataOrder[0]._id}  de ${dateRecep}  n'a pas pu être traitée`)
            res.status(200).send("DONE");
        }else{
            res.status(401).send("CETTE COMMANDE N'EXISTE PAS")
        }
    }else{
        res.status(401).send("MERCI DE DONNER LE NUM DE COMMANDE")
    }
})

router.post("/done", async function (req,res,next) {
    if(req.body.numCommande){
        let order = new Order({status : 'done'})
        await order.update({numCommande : req.body.numCommande, isRemoved : false})
        let dataOrder = await order.get({numCommande : req.body.numCommande, isRemoved : false})
        if(dataOrder.length !=0){
            let dateHeureRecep = new Date(dataOrder[0].dateHeureRecep);
            let dateRecep = dateHeureRecep.toLocaleString();
            await informerClient(dataOrder[0].idClient, dataOrder[0]._id,  `votre commande N° ${dataOrder[0]._id}  de ${dateRecep} est prête. bon appétit`)
            res.status(200).send("DONE");
        }else{
            res.status(401).send("CETTE COMMANDE N'EXISTE PAS")
        }
    }else{
        res.status(401).send("MERCI DE DONNER LE NUM DE COMMANDE")
    }
})

module.exports = router;
