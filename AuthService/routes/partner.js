var express = require('express');
var User = require('../classes/User')
const {phone} = require('phone')
const Role = require('../classes/Role')
var router = express.Router();

// new partner

router.post("/step1", async function (req,res,next) {
    if(!req.body.firstName || !req.body.lastName) res.status(401).send("MERCI DE REMPLIR TOUS LES CHAMPS.")
    else{
        let user = new User({firstName: req.body.firstName,
                            lastName : req.body.lastName, 
                            isRemoved : false,
                            isVerified : false,
                            isActive : true,
                            isReseted : false
        });
        let idUser = user.post();
        res.status(200).send(idUser.insertedId);
    }
  })

  router.post("/step2", async function (req,res,next) {
    if(!req.body.email || !req.body.phone) res.status(401).send("MERCI DE REMPLIR TOUS LES CHAMPS.")
    else{
        let user = new User({email: req.body.email,
                            phone : req.body.phone
        });
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            res.status(401).send("L'ADRESSE MAIL N'EST PAS VALIDE");
        }
        let phoneNumber = req.body.phone
        let result = phone(phoneNumber, {country: 'MA'});
        if(!result.isValid){
            res.status(401).send("LE NUMERO DE TELEPHONE N'EST PAS VALIDE");      
        }
        let newUser = new User({email : req.body.email, phone : result.phoneNumber})
        // update by id !!!!!!!!!!!!!!!!!!!!
        await newUser.update({});
        let role = new Role({role : 'partner', idUser : req.body.id, isRemoved : false})
        await role.post();
        // get the user info by id
        // send it
        res.status(200).send();
    }
  })
