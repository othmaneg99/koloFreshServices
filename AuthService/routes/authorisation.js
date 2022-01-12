"use strict";
var express = require("express");
var User = require("../classes/User");
const jwt = require("jsonwebtoken");
const Role = require("../classes/Role");
var generator = require("generate-password");
var bcrypt = require("bcrypt");
Request = require("../classes/Request");
var router = express.Router();

//verify Token

async function verifyToken(token) {
  try {
    await jwt.verify(token, process.env.PrivateKey);
    let infoUser = jwt.decode(token);
    return infoUser;
  } catch (err) {
    console.log(err.message);
    return false;
  }
}

router.use(async function (req, res, next) {
  let token = req.body.token;
  if (!token) {
    req.body._id = 0;
  } else {
    let infoUser = await verifyToken(token);
    if (!infoUser) req.body._id = 0;
    // token invalid
    else {
      let user = new User({});
      let existUser = await user.get({ _id: infoUser._id, isRemoved: false });
      if (existUser.length == 0) {
        res.status(401).send("CE UTILISATEUR N'EXISTE PAS");
      } else {
        req.body._id = infoUser._id;
      }
    }
  }
  next();
});

router.post("/generateMDP", async function (req, res, next) {
  if (req.body._id == 0) res.status(401).send("TOKEN INVALID");
  else {
    // token valid
    if (req.body.idPartner) {
      let user = new User({});
      let existUser = await user.get({ _id: req.body._id, isRemoved: false });
      if (existUser.length == 0) {
        res.status(401).send("CE UTILISATEUR N'EXISTE PAS");
      } else {
        let role = new Role({});
        let existRole = await role.get({
          idUser: req.body._id,
          role: "admin",
          isRemoved: false,
        });
        if (existRole) {
          let existPartner = await role.get({
            idUser: req.body.idPartner,
            role: "partner",
            isRemoved: false,
          });
          if (existPartner) {
            var password = generator.generate({
              length: 15,
              numbers: true,
              uppercase: true,
            });
            let hashedPassword = await bcrypt.hash(password, 49999999999999999);
            let userUpdate = new User({
              password: hashedPassword,
              isActive: true,
            });
            await userUpdate.update({ _id: req.body.idPartner });
            existUser = await user.get({
              _id: req.body.idPartner,
              isRemoved: false,
            });
            if (existUser[0].email) {
              // envoi mail
              const request = new Request();
              const resultEnvoi = await request.postEmail(
                process.env.EmailService + "/generateMDP",
                {
                  nom: existUser[0].firstName + " " + existUser[0].lastName,
                  email: existUser[0].email,
                  password: password,
                }
              );
              res.status(resultEnvoi.status).send(resultEnvoi.msg);
            } else {
              res
                .status(200)
                .send(
                  "CE UTILISATEUR N'A PAS UNE ADRESSE MAIL, LE MOT DE PASSE EST " +
                    password
                );
            }
          } else {
            res.status(401).send("CE PARTNER N'EXISTE PAS");
          }
        } else {
          res.status(401).send("VOUS N'AVEZ PAS LE ROLE ADMIN");
        }
      }
    } else {
      res.status(401).send("CE PARTNER N'EXISTE PAS");
    }
  }
});
module.exports = router;
