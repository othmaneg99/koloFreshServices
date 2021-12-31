var express = require('express');
var Token = require('../classes/Token')
var router = express.Router();

//get Token

async function getAccess(token) {
    const tokenObject = new Token({})
    let tokenUser = await tokenObject.get({token : token, isRemoved : false})
    return tokenUser
  }

router.post('/logout',async function(req,res,next){
        let result = await getAccess(req.body.token);
        if(result.length !=0){
            var tokenUser = new Token({isRemoved : true})
            await tokenUser.update({token : req.body.token, isRemoved : false})
            res.status(200).send('You have successfully logged out!')
        }else{
            res.status(401).send('TOKEN INVALID')
        }
  })
 
module.exports = router;
