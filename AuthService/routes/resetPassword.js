var express = require("express");
var router = express.Router();
var User = require("../classes/User");
var Role = require("../classes/Role");
var { phone } = require("phone");
var bcrypt = require("bcrypt");
var generator = require("generate-password");
var Request = require("../classes/Request");

require("dotenv").config();

router.post("/", async function (req, res, next) {
  let user = new User({});
  let userData;
  if (!req.body.userName) {
    res.status(500).send("MERCI DE REMPLIR TOUS LES CHAMPS.");
  } else {
    let filters;
    let validFilter = true;
    if (req.body.userName.includes("@"))
      filters = { email: req.body.userName, isRemoved: false };
    else {
      let result = phone(req.body.userName, { country: "MA" });
      if (result.isValid) {
        filters = { phone: result.phoneNumber, isRemoved: false };
      } else {
        validFilter = false;
        res.status(401).send("LE NOM D'UTILISATEUR N'EST PAS VALIDE");
      }
    }
    if (validFilter) {
      userData = await user.get(filters);
      // user n'existe pas
      if (userData.length == 0) {
        res.status(401).send("CE UTILISATEUR N'EXISTE PAS");
      } // utilisateur existe
      else {
        // vérifier le role send role partner si il s'agit d'un cuisinier
        const passedRole = req.body.role ? req.body.role : "customer";
        let role = new Role({});
        let hasRole;
        let isValid = false;
        // check for each exist user
        for (let i = 0; i < userData.length; i++) {
          hasRole = await role.get({
            role: passedRole,
            idUser: userData[i]._id,
            isRemoved: false,
          });
          // l'utilisateur a le role
          if (hasRole.length != 0) {
            isValid = true; // user a le role
            var password = generator.generate({
              length: 15,
              numbers: true,
              uppercase: true,
            });
            let hashedPassword = await bcrypt.hash(password, 49999999999999999);
            let userUpdate = new User({
              password: hashedPassword,
              isReseted: true,
            });
            await userUpdate.update({ _id: userData[i]._id });
            existUser = await user.get({
              _id: userData[i]._id,
              isRemoved: false,
            });
            if (existUser[0].email) {
              // envoi mail
              const request = new Request();
              const resultEnvoi = await request.postReq(
                process.env.EmailService + "/newPassword",
                {
                  email: existUser[0].email,
                  nom: existUser[0].firstName + " " + existUser[0].lastName,
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
          }
        }
        // l'utilisateur n'a pas le role
        if (!isValid) res.status(401).send("CE UTILISATEUR N'EXISTE PAS");
      }
    }
  }
});

module.exports = router;
