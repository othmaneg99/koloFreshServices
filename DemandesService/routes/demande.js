var express = require("express");
var router = express.Router();
let Notification = require("../classes/Notification");
const date = require("date-and-time");

/* new demande de creation de shop*/
router.post("/newPartner", async function (req, res, next) {
  let now = new Date();
  let dateNow = date.addHours(now, 1);
  let notification = new Notification({
    idUser: req.body.idUser,
    status: "pending",
    _createdAt: dateNow.toISOString().replace(/T/, " ").replace(/\..+/, ""),
    type: "new",
    isRemoved: false,
  });
  await notification.post();
  res.status(200).send("done");
});

module.exports = router;
