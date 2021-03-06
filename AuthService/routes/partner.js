var express = require("express");
var User = require("../classes/User");
const { phone } = require("phone");
const Role = require("../classes/Role");
var Request = require("../classes/Request");
const { isValid } = require("ipaddr.js");
const date = require("date-and-time");

var router = express.Router();

// new partner

router.post("/register", async function (req, res, next) {
  let isValid = true;
  if (!req.body.firstName || !req.body.lastName || !req.body.phone)
    res.status(401).send("MERCI DE REMPLIR TOUS LES CHAMPS.");
  else {
    if (req.body.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
        isValid = false;
        res.status(401).send("L'ADRESSE MAIL N'EST PAS VALIDE");
      }
    }
    if (isValid) {
      let phoneNumber = req.body.phone;
      let result = phone(phoneNumber, { country: "MA" });
      if (!result.isValid) {
        res.status(401).send("LE NUMERO DE TELEPHONE N'EST PAS VALIDE");
      } else {
        let user = new User({});
        let userData1;
        let userData2;
        let role1;
        let resultRole;
        // verifier email existe ou non
        if (req.body.email) {
          userData1 = await user.get({
            email: req.body.email,
            isRemoved: false,
          });
          // user existe deja email unique
          if (userData1.length != 0) {
            // verifier avec role partner
            role1 = new Role({});
            // verifier pour tous les users with the same @mail
            for (let i = 0; i < userData1.length; i++) {
              resultRole = await role1.get({
                role: "partner",
                idUser: userData1[i]._id,
                isRemoved: false,
              });
              if (resultRole.length != 0) {
                isValid = false;
                res.status(401).send("CE UTILISATEUR EXISTE DEJA");
              }
            }
          }
        }
        if (isValid) {
          // verifier phone existe ou non
          userData2 = await user.get({
            phone: result.phoneNumber,
            isRemoved: false,
          });
          // user existe deja email et phone unique
          if (userData2.length != 0) {
            // verifier avec role partner
            role1 = new Role({});
            // verifier pour tous les users with the same phoneNumber
            for (let i = 0; i < userData2.length; i++) {
              resultRole = await role1.get({
                role: "partner",
                idUser: userData2[i]._id,
                isRemoved: false,
              });
              if (resultRole.length != 0) {
                isValid = false;
                res.status(401).send("CE UTILISATEUR EXISTE DEJA");
              }
            }
          }
          if (isValid) {
            let now = new Date();
            let dateNow = date.addHours(now, 1);
            let userData = {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              isRemoved: false,
              isVerified: false,
              isActive: false, // a besion d'un mot de passe et acceptation de admin
              isReseted: false,
              email: req.body.email,
              phone: result.phoneNumber,
              _createdAt: dateNow
                .toISOString()
                .replace(/T/, " ")
                .replace(/\..+/, ""),
            };
            user = new User(userData);
            let idUser = await user.post();
            let role = new Role({
              role: "partner",
              idUser: idUser.insertedId,
              isRemoved: false,
            });
            await role.post();
            // envoi mail (req.body.nom, req.body.phone,req.body.nomAdmin, req.body.emailAdmin)
            let adminDataRole = await role.get({
              role: "admin",
              isRemoved: false,
            });
            let adminData = await user.get({ _id: adminDataRole[0].idUser });
            const request = new Request();
            await request.postReq(process.env.EmailService + "/newPartner", {
              nom: req.body.firstName + " " + req.body.lastName,
              phone: result.phoneNumber,
              nomAdmin: adminData[0].firstName + " " + adminData[0].lastName,
              emailAdmin: adminData[0].email,
            });
            // appel notifaction service => create a notification
            await request.postReq(
              process.env.DemandeService + "/demande/newPartner",
              {
                idUser: idUser.insertedId,
              }
            );
            userData._id = idUser.insertedId;
            res.status(200).send(userData);
          }
        }
      }
    }
  }
});

module.exports = router;
