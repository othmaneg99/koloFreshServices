var express = require('express');
var User = require('../classes/User')
const {phone} = require('phone')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var router = express.Router();

//verify Token
  
async function verifyToken(token) {
    try {
        console.log(token)
      await jwt.verify(token, process.env.PrivateKey);
      let infoUser = jwt.decode(token);
      console.log(infoUser)
      return infoUser
    }catch(err){
        console.log(err.message)
      return false
  }
    
  }

  
router.use(async function (req, res, next) {
    let token = req.body.token;
    console.log(typeof token)
    if(!token)req.body._id = undefined
    else{
        console.log('i am here')
        let infoUser = await verifyToken(token);
        console.log(infoUser)
        if(!infoUser)req.body._id = undefined
        else{
            let user = new User({});
            let existUser = await user.get({_id : infoUser._id, isRemoved : false})
            console.log(existUser)
            if(existUser.length == 0){res.status(401).send("CE UTILISATEUR N'EXISTE PAS")}
            else {
                req.body._id = infoUser._id;
                next()
            }
        }
    }
  });

router.post('/information',async function(req,res,next){
    console.log('i am here 2')
    if(!req.body._id) res.status(401).send("TOKEN INVALID")
    else{
        const user = new User({});
        let existUser = await user.get({_id : req.body._id, isRemoved : false});
        if(existUser.length == 0){
            res.status(401).send("CE UTILISATEUR N'EXISTE PAS")
        }else{
            res.status(200).send({firstName : existUser[0].firstName, lastName : existUser[0].lastName, phone : existUser[0].phone, email : existUser[0].email})
        }
    }
  })

router.post('/updateUser', async function(req,res,next){
    let oldPassword = req.body.password;
    if(!oldPassword) res.status(401).send("L'ANCIEN MOT DE PASSE EST OBLIGATOIRE")
    let dataUser = {firstName :req.body.firstName, lastName : req.body.lastName, phone : req.body.phone, email : req.body.email};
    let user = new User({});
    // find by id !!!!!!!!!!!!!!!!
    let existUser = await user.get({email : req.body.email,  isRemoved : false});
    if(existUser.length == 0){
        res.status(401).send("CE UTILISATEUR N'EXISTE PAS")
    }else if(!existUser[0].password) res.status(401).send("VOUS AVEZ PAS LE DROIT DE CHANGER CES DONNEES (AUTENTIFICATION PAR GOOGLE)")
    else{
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
            let phoneNumber = req.body.phone;
            let result = phone(phoneNumber, {country: 'MA'});
            if(!result.isValid){
                res.status(401).send("LE NUMERO DE TELEPHONE N'EST PAS VALIDE");
            }else if(result.phoneNumber != existUser[0].phone){
                let userNewPhone = await user.get({phone : result.phoneNumber,  isRemoved : false})
                if(userNewPhone.length !=0){
                    res.status(401).send("CE UTILISATEUR EXISTE DEJA")
                }
            }
            dataUser.phone = result.phoneNumber;
            //password 
            if(req.body.newpassword){
                let password = req.body.newpassword;
                if(password.length < 8) {
                    res.status(401).send("LA TAILLE DU MOT DE PASSE DOIT ETRE SUPERIEUR A 8");
                }else{
                    let hashedPassword = await bcrypt.hash(req.body.newpassword, 49999999999999999)
                    dataUser.password = hashedPassword;
                }
            }
            let newUser = new User(dataUser)
            await newUser.update({email : req.body.email,  isRemoved : false})
            if(dataUser.password) delete dataUser.password
            res.status(200).send(dataUser)
        }
    }
  })

 
module.exports = router;
