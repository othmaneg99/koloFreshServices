var express = require('express');
var User = require('../classes/User')
const {phone} = require('phone')
const Role = require('../classes/Role')
var router = express.Router();

// new partner

  router.post("/register", async function (req,res,next) {
    if(!req.body.firstName || !req.body.lastName || !req.body.phone) res.status(401).send("MERCI DE REMPLIR TOUS LES CHAMPS.")
    else{
        if(req.body.email){
            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))res.status(401).send("L'ADRESSE MAIL N'EST PAS VALIDE")
        }
        let phoneNumber = req.body.phone
        let result = phone(phoneNumber, {country: 'MA'});
        if(!result.isValid){
            res.status(401).send("LE NUMERO DE TELEPHONE N'EST PAS VALIDE");      
        }
        let user = new User({});
        if(req.body.email){
        // verifier email existe ou non
        let userData1 = await user.get({email : req.body.email, isRemoved : false})
        if(userData1.length !=0) {
            // verifier avec role partner
            let role1 = new Role({})
            let resultRole1 = await role1.get({role : 'partner', idUser : userData1._id, isRemoved : false})
            if(resultRole1.length!=0) res.status(401).send("CE UTILISATEUR EXISTE DEJA")
        }
        }
        // verifier phone existe ou non
        let userData2 = await user.get({phone :  result.phoneNumber, isRemoved : false})
        if(userData2.length !=0) {
            // verifier avec role partner
            let role2 = new Role({})
            let resultRole2 = await role2.get({role : 'partner', idUser : userData2._id, isRemoved : false})
            if(resultRole2.length!=0) res.status(401).send("CE UTILISATEUR EXISTE DEJA")
        } 
        user = new User({firstName: req.body.firstName,
            lastName : req.body.lastName, 
            isRemoved : false,
            isVerified : false,
            isActive : false, // a besion d'un mot de passe et acceptation de admin
            isReseted : false,
            email: req.body.email,
            phone : result.phoneNumber
        });
        let idUser = await user.post();
        let role = new Role({role : 'partner', idUser : idUser.insertedId, isRemoved : false})
        await role.post();
        // get the user info by id
        let userData = await user.get({_id : idUser.insertedId, isRemoved : false})
        // send it
        res.status(200).send(userData);
    }
  })

  module.exports = router;

