var express = require("express");
var router = express.Router();
let Notification = require("../classes/Notification");
const date = require("date-and-time");
var app = express();
//Get Request:
app.get("/", async (req, res) => {
  const notification = new Notification({});
  const data = await notification.getSort(req.query.filters);
  res.send(data);
});

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

/* new demande de creation de shop*/
router.post("/newDemande", async function (req, res, next) {
  let now = new Date();
  let dateNow = date.addHours(now, 1);
  let notification = new Notification({
    idUser: req.body.idUser,
    status: "pending",
    _createdAt: dateNow.toISOString().replace(/T/, " ").replace(/\..+/, ""),
    type: req.body.type,
    newCat: req.body.categorie,
    isRemoved: false,
  });
  await notification.post();
  res.status(200).send("done");
});

//update Request:

app.patch("/", async (req, res) => {
  const filters = req.body.filters;
  const data = req.body.data;
  const notification = new Notification(data);
  res.send(await notification.update(filters));
});

//Delete Request
app.delete("/", async (req, res) => {
  const filters = req.body.filters;
  const notification = new Notification({});
  res.send(await notification.delete(filters));
});
module.exports = app;
