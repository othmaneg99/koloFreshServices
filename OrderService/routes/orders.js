"use strict";
var nodemailer = require('nodemailer');
var express = require('express');
var Order = require('../classes/Order')
var User = require('../classes/User')
var router = express.Router();
require('dotenv').config()

function checkTime(dateHeureRecep) {
    let dateRecep = new Date(dateHeureRecep);
    let dateNow = new Date();
    let diff = Math.abs(dateRecep.getTime() - dateNow.getTime()) / 3600000; // return nb hours
    if (diff < 1) { return true }
    return false
}

async function informerClient(idClient, decision) {
    let user = new User({})
    let existUser = await user.get({_id : idClient, isRemoved : false})
    if(existUser){
        let decisionCMD = decision=='refus'? "votre commande n'a pas pu être traitée" : "votre commande est en cours de préparation"
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
            subject: `KOLO FRESH | ${decisionCMD}`,
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
/* GET new orders. */
router.get('/new', async function(req, res, next) {
    let order = new Order({})
    let listOrders = await order.get({idShop : req.query.idShop, status : 'new', isRemoved : false});
    let newListOrders = [];
    for (let i = 0; i < listOrders.length; i++) {
        if(checkTime(listOrders[i].dateHeureRecep)){
            newListOrders.push(listOrders[i])
        }else{
            // fix problem user déjà informe par mail !!!!!!!!!!!
            await informerClient(listOrders[i].idClient, 'refus');
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
