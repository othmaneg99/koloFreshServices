var express = require("express");
var User = require("../classes/User");
const { phone } = require("phone");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

router.post("/information", async function (req, res, next) {
  if (req.body._id == 0) res.status(401).send("TOKEN INVALID");
  else {
    // tokrn valid
    const user = new User({});
    let existUser = await user.get({ _id: req.body._id, isRemoved: false });
    if (existUser.length == 0) {
      res.status(401).send("CE UTILISATEUR N'EXISTE PAS");
    } else {
      res.status(200).send({
        firstName: existUser[0].firstName,
        lastName: existUser[0].lastName,
        phone: existUser[0].phone,
        email: existUser[0].email,
      });
    }
  }
});

router.post("/updateUser", async function (req, res, next) {
  if (req.body._id == 0) res.status(401).send("TOKEN INVALID");
  else {
    let isValid = true;
    let oldPassword = req.body.password;
    if (!oldPassword)
      res.status(401).send("L'ANCIEN MOT DE PASSE EST OBLIGATOIRE");
    else {
      let dataUser = { phone: req.body.phone, email: req.body.email };
      let user = new User({});
      let existUser = await user.get({ _id: req.body._id, isRemoved: false });
      if (existUser.length == 0) {
        res.status(401).send("CE UTILISATEUR N'EXISTE PAS");
      } else if (!existUser[0].password && existUser[0].isActive == true)
        res
          .status(401)
          .send(
            "VOUS AVEZ PAS LE DROIT DE CHANGER CES DONNEES (AUTHENTIFICATION PAR GOOGLE)"
          );
      else {
        let match = await bcrypt.compare(oldPassword, existUser[0].password);
        if (!match) {
          res.status(401).send("L'ANCIEN MOT DE PASSE EST INCORRECT");
        } else {
          //email
          if (req.body.email != existUser[0].email) {
            // verifier si email est valide
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
              isValid = false;
              res.status(401).send("L'ADRESSE MAIL N'EST PAS VALIDE");
            } else {
              // verifier si mail existe deja ou nom
              let userNewMail = await user.get({
                email: existUser[0].email,
                isRemoved: false,
              });
              if (userNewMail.length != 0) {
                isValid = false;
                res.status(401).send("CE UTILISATEUR EXISTE DEJA");
              } else {
                dataUser.isVerified = false;
              }
            }
          }
          if (isValid) {
            // email valid and exist
            //phone
            let phoneNumber = req.body.phone;
            let result = phone(phoneNumber, { country: "MA" });
            if (!result.isValid) {
              isValid = false;
              res.status(401).send("LE NUMERO DE TELEPHONE N'EST PAS VALIDE");
            } else if (result.phoneNumber != existUser[0].phone) {
              let userNewPhone = await user.get({
                phone: result.phoneNumber,
                isRemoved: false,
              });
              if (userNewPhone.length != 0) {
                isValid = false;
                res.status(401).send("CE UTILISATEUR EXISTE DEJA");
              }
            }
            if (isValid) {
              // phone valid and exist
              dataUser.phone = result.phoneNumber;
              //password
              if (req.body.newpassword) {
                let password = req.body.newpassword;
                if (password.length < 8) {
                  isValid = false;
                  res
                    .status(401)
                    .send("LA TAILLE DU MOT DE PASSE DOIT ETRE SUPERIEUR A 8");
                } else {
                  let hashedPassword = await bcrypt.hash(
                    req.body.newpassword,
                    49999999999999999
                  );
                  dataUser.password = hashedPassword;
                }
              }
              if (isValid) {
                let newUser = new User(dataUser);
                await newUser.update({ _id: req.body._id, isRemoved: false });
                if (dataUser.password) delete dataUser.password;
                res.status(200).send(dataUser);
              }
            }
          }
        }
      }
    }
  }
});

module.exports = router;
