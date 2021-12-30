var express = require('express');
var router = express.Router();
var User = require("../classes/User")
var Token = require('../classes/Token')
var bcrypt = require('bcrypt')  
  
  //verify Token
  
  function verifyToken(token) {
    try {
      jwt.verify(token, process.env.PrivateKey);
      return token
    }catch(err){
        console.log(err.message)
      return false
  }
    
  }
  // get access token by user id
  
  async function getAccess(id) {
    const tokenObject = new Token({})
    let tokenUser = await tokenObject.get({idUser : id, isRemoved : undefined})
    return tokenUser
  }

  
router.use(async function (req, res, next) {
    let accessToken = getAccess(req.body.id);
    if(accessToken.length == 0){res.status(401).status("TOKEN N'EXISTE PAS")}
    else{
        let user = new User({});
        let existUser = await user.get({_id : req.body.id})
        if(existUser.length == 0){res.status(401).send("CE UTILISATEUR N'EXISTE PAS")}
        else {
            let token = verifyToken(accessToken[0]);
            // access token error
            if(!token){
              res.status(401).send("ACCESS TOKEN INVALIDE")
            } // access token generated with success
            else{
              next()
            }
        }
    }
  });
  router.post('/sendCodeReset', async function(req, res, next) {
    let user = new User({isReseted : true})
    let UserAfterReset = await user.update({_id : req.body.id})
    res.status(200).send("CODE SEND")
  });

  

module.exports = router;