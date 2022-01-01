var express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var router = express.Router();
var User = require("../classes/User")
var Token = require("../classes/Token")
var Role = require('../classes/Role')
var {phone} = require('phone')
const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt')

require('dotenv').config()

/* generate access token */

async function generateToken(userData, rememberMe) {
  // duree de 15 jours <= 360h
  let duree = rememberMe? '360h' : '10h';
  let accessToken = jwt.sign(userData, process.env.PrivateKey, { expiresIn: duree }); 
  let tokenData = new Token({token : accessToken, idUser : userData._id, isRemoved : false})
  await tokenData.post();
  return accessToken
}


//verify Token

async function verifyToken(userData,token, rememberMe) {

  try {
    jwt.verify(token, process.env.PrivateKey);
    return token
  }catch(err){
    if(err.message=='jwt expired'){
       let duree = rememberMe? '360h' : '10h';
        let accessToken = jwt.sign(userData, process.env.PrivateKey, { expiresIn: duree });
        // update token in database 
        const refreshToken = new Token({})
        await refreshToken.update({ idUser : userData._id}, {token :accessToken})
        return accessToken
    }else{
        console.log(err.message)
        return false
    }
}
  
}
// get access token by user id

async function getAccess(id) {
  const tokenObject = new Token({})
  let tokenUser = await tokenObject.get({idUser : id, isRemoved : false})
  return tokenUser
}


// verify password and generate access token or just verify access token
async function checkPasswordAndSendToken(passwordEnterByUser,userData, rememberMe) {
  let password = userData.password
  let accessToken
  if(password){
    let match = await bcrypt.compare(passwordEnterByUser, password);
      if(match){ 
          // password correct 
            if(userData.isreset == false){
              return "VOUS AVEZ SAISI L'ANCIEN MOT DE PASSE"
            /*}else if(userData.isverified == false){
              return 'VOUS DEVEZ VERIFIER VOTRE COMPTE'*/
            }else{
               //  check if the user has token or not
              let existUser = await getAccess(userData._id)
              accessToken = existUser.length == 0 ? await generateToken(userData,rememberMe) : verifyToken(userData,existUser[0].token,rememberMe)
              return accessToken
            }
      }else{
          return false
      }
}else{
  return false
}
}

/* GOOGLE Auth */

router.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET 
  }));

  var userProfile, GoogleAccessToken;

  router.use(passport.initialize());
  router.use(passport.session());
  
  
  router.get('/success', async function(req, res) { 
    // chercher si l'utilisateur existe déjà
    let user = new User({});
    let existUser = await user.get({isRemoved : false, email : userProfile.emails[0].value});
    // new user
    if(existUser.length == 0) {
          let userData = { id_google : userProfile.id,
          lastName : userProfile.name.familyName,
          firstName : userProfile.name.givenName,
          isRemoved : false,
          email :userProfile.emails[0].value,
          isVerified : true,
          isReseted : false,
          isActive : true};
          let newUser = new User(userData);
          let userId = await newUser.post();
          let role = new Role({role : 'customer', idUser : userId.insertedId, isRemoved : false})
          await role.post();
          userData._id = userId.insertedId
          let token = await generateToken(userData, true);
        res.status(200).send({user: newUser, token: token});
          // exist user 
        }else{
          // verifier le role
          let role = new Role({})
          hasRole = await role.get({role : 'customer', idUser : existUser[0]._id, isRemoved : false});
          // l'utilisateur n'a pas le role
          if(hasRole.length ==0) {
            let role = new Role({role : 'customer', idUser : existUser[0]._id, isRemoved : false})
            await role.post()
          }
          // verify token 
            let tokenUser = await getAccess(existUser[0]._id);
            if(tokenUser.length == 0) { 
              let accessToken = await generateToken(existUser[0],true)
              res.status(200).send({user: existUser[0], token: accessToken});
            }else{
              let accessToken = await verifyToken(existUser[0],tokenUser[0].token, true);
              // access token error
              if(!accessToken){
                res.status(401).send("ACCESS TOKEN INVALIDE")
              } // access token generated with success
              else{
                res.status(200).send({user: existUser[0], token: accessToken});
              }
            }
          } 
    });
  router.get('/error', (req, res) => res.status(401).send("error logging in"));
  
  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });
  
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK
    },
    function(accessToken, refreshToken, profile, done) {
        userProfile=profile;
        GoogleAccessToken = accessToken
        return done(null, userProfile);
    }
  ));
   
  router.get('/google', 
    passport.authenticate('google', { scope : ['profile', 'email'] }));
   
    router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login/error' }),
    function(req, res) {
      // Successful authentication, redirect success.
      res.redirect('/login/success');
    });
  

/* KOLO FRESH Auth */

router.post('/', async function(req, res) {
    let user = new User({})
    let userData
    let accessToken
    if(!req.body.userName || !req.body.password) {res.status(500).send("MERCI DE REMPLIR TOUS LES CHAMPS.")}
    else{
      let filters 
      if((req.body.userName).includes("@")) filters = {email : req.body.userName, isRemoved : false} 
      else{
        let result = phone(req.body.userName, {country: 'MA'});
        if(result.isValid){filters = {phone : result.phoneNumber, isRemoved : false}}
        else {res.status(401).send("LE NOM D'UTILISATEUR N'EST PAS VALIDE");}
      }
    userData = await user.get(filters)
    // user n'existe pas
    if(userData.length == 0){
      res.status(401).send("CE UTILISATEUR N'EXISTE PAS")
    }// utilisateur existe
    else{
      // vérifier le role send role partner si il s'agit d'un cuisinier
      const passedRole = req.body.role? req.body.role : 'customer'
      let role = new Role({})
      let hasRole;
      let isValid= false;
      // check for each exist user
      for (let i = 0; i < userData.length; i++) {
        hasRole = await role.get({role : passedRole, idUser : userData[i]._id, isRemoved : false});
        // l'utilisateur a le role
        if(hasRole.length !=0) 
        {
            isValid = true; // user a le role
            // vérifier mot de passe et générer token
            accessToken = await checkPasswordAndSendToken(req.body.password,userData[i], req.query.rememberMe)
            if(accessToken == "VOUS AVEZ SAISI L'ANCIEN MOT DE PASSE" /*|| accessToken == 'VOUS DEVEZ VERIFIER VOTRE COMPTE'*/){  
              res.status(401).send(accessToken)
            }else if(accessToken){
              res.status(200).send(accessToken) 
            }else{
              res.status(401).send("NOM D'UTILISATEUR OU MOT DE PASSE EST INCORRECT")
            }   
        }
      }
      // l'utilisateur n'a pas le role
      if(!isValid) res.status(401).send("CE UTILISATEUR N'EXISTE PAS")
    }
    }
  });

module.exports = router;
