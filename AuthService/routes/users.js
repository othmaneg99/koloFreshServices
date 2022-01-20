var express = require("express");
var User = require("../classes/User");
const { phone } = require("phone");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var router = express.Router();

router.get("/information", async function (req, res, next) {
  // tokrn valid
  const user = new User({});
  let existUser = await user.get({ _id: req.query._id, isRemoved: false });
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
});

module.exports = router;
