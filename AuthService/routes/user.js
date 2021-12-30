var express = require('express');
var User = require('../classes/User')
const phone = require('phone')
const bcrypt = require('bcrypt')
var router = express.Router();


router.get('/information',async function(req,res,next){
    const user = new User({});
    let existUser = await user.get({_id : req.query.id, isRemoved : false});
    if(existUser.length == 0){
        res.status(401).send("CE UTILISATEUR N'EXISTE PAS")
    }else{
        res.status(200).send({firstName : existUser[0].firstName, lastName : existUser[0].lastName, phone : existUser[0].phone, email : existUser[0].email})
    }
  })

router.post('/updateUser', async function(req,res,next){
    let oldPassword = req.body.password;
    let dataUser = {firstName :req.body.firstName, lastName : req.body.lastName, phone : req.body.phone, email : req.body.email};
    let user = new User({});
    let existUser = await user.get({email : req.body.email,  isRemoved : false});
    if(existUser.length == 0){
        res.status(401).send("CE UTILISATEUR N'EXISTE PAS")
    }
    let match = await bcrypt.compare(oldPassword, existUser[0].password);
    if(!match){
        res.status(401).send("L'ANCIEN MOT DE PASSE EST INCORRECT")
    }
    else{
        //email
        if(req.body.email != existUser[0].email){
            // verifier si email est valide
            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
                res.status(401).send("L'ADRESSE MAIL N'EST PAS VALIDE");
            }
            // verifier si mail existe deja ou nom
            let userNewMail = await user.get({email : existUser[0].email,  isRemoved : false})
            if(userNewMail.length !=0){
                res.status(401).send("CE UTILISATEUR EXISTE DEJA")
            }else{
                dataUser.isVerified = false;
            }
        }
        //phone
        if(req.body.phone != existUser[0].phone){
            let result = phone(phoneNumber, {country: 'MA'});
            if(!result.isValid){
                res.status(401).send("LE NUMERO DE TELEPHONE N'EST PAS VALIDE");
            }
        }
        //password 
        if(req.body.newpassword){
            let password = req.body.password;
            if(password.length < 8) {
                res.status(401).send("LA TAILLE DU MOT DE PASSE DOIT ETRE SUPERIEUR A 8");
            }else{
                let hashedPassword = await bcrypt.hash(req.body.password, 49999999999999999)
                dataUser.password = hashedPassword;
            }
        }
        let newUser = new User(dataUser)
        await newUser.update({email : req.body.email,  isRemoved : false})
        if(dataUser.password) delete dataUser.password
        res.status(200).send(dataUser)
    }
  })


 
module.exports = router;
