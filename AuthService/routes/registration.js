var express = require('express');
var router = express.Router();
var User = require("../classes/User")
const {phone} = require('phone');
var bcrypt = require('bcrypt');
const Role = require('../classes/Role');

require('dotenv').config()


// registration user
router.post('/', async function(req, res, next) {
   if(!req.body.email || !req.body.phone || !req.body.password || !req.body.firstName || !req.body.lastName) {
     res.status(500).send("MERCI DE REMPLIR TOUS LES CHAMPS.")
   }else {
    let user = new User({});
    let userData = await user.get({email : req.body.email, isRemoved : false})
    // verify phone
    let phoneNumber = req.body.phone
    let result = phone(phoneNumber, {country: 'MA'});
    if(!result.isValid){
      res.status(401).send("LE NUMERO DE TELEPHONE N'EST PAS VALIDE");      
    }else{
      let userData2 = await user.get({phone :  result.phoneNumber, isRemoved : false})
      // user existe deja
      if(userData.length != 0 || userData2.length !=0){
          res.status(401).send("CE UTILISATEUR EXISTE DEJA")
      }
      // new user
      else{
        let password=req.body.password
        let email = req.body.email
        // verify taille mot de passe 
        if(password.length < 8) {
          res.status(401).send("LA TAILLE DU MOT DE PASSE DOIT ETRE SUPERIEUR A 8");
        }// verify @ email
        else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
          res.status(401).send("L'ADRESSE MAIL N'EST PAS VALIDE");
        }// add new user
        else{
          let hashedPassword = await bcrypt.hash(req.body.password, 49999999999999999)
          let newUser = new User({
              email : email,
              phone : result.phoneNumber,
              password : hashedPassword,
              firstName : req.body.firstName, 
              lastName : req.body.lastName, 
              isRemoved : false,
              isVerified : false,
              isReseted : false, 
              isActive : true
          });
          let userId = await newUser.post();
          const passedRole = req.body.role? req.body.role : 'customer'
          let role = new Role({role : passedRole, idUser : userId.insertedId, isRemoved : false})
          await role.post();
          let newUserData = await newUser.get({email : email, isRemoved : false});
          res.status(200).send({user : newUserData});
        }
      }
      }   
    }
  });

  module.exports = router;
