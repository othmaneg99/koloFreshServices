const { default: axios } = require("axios");
var express = require("express");
const Request = require("../classes/Request");
var app = express();

/* GET users listing. */
const request = new Request();

app.get('/', async (req, res) => {
    filters = JSON.parse(req.query.filters)
    console.log(filters)
    await request.get(process.env.demandesService+'/demande', req.query).then((data) =>{
      if (data.response) {
        console.log(data.response.status);
        res.status(data.response.status).send(data.response.data);
      } else res.status(200).send(data);
    })
    .catch((e) => {
      res.status(403).send(e);
    });
});



app.post('/', async function (req, res, next) {
  await request
    .post(process.env.demandesService+'/demande/newPartner', req.body)
    .then((data) => {
      if (data.response) {
        console.log(data.response.status);
        res.status(data.response.status).send(data.response.data);
      } else res.status(200).send(data);
    })
    .catch((e) => {
      res.status(403).send(e);
    });
});

app.patch('/',async function (req, res, next) {
    await request.update(process.env.demandesService+'/demande', req.body).then((data) => {
        console.log(data)
        res.status(200).send(data)
      }).catch((e) => {
        res.status(403).send(e)
      })

})

app.delete("/",async function (req, res, next) {
    await request.delete(process.env.demandesService+'/demande' , {data: req.body}).then((data) => {
        console.log(data)
        res.status(200).send(data)
      }).catch((e) => {
        console.log(e)
        res.status(403).send(e)
      })

})


module.exports = app;
