const { default: axios } = require("axios");
var express = require("express");
const Request = require("../classes/Request");
var app = express();

/* GET users listing. */
const request = new Request();

app.post("/logout", async function (req, res, next) {
  await request
    .post(process.env.authService + "/logout", req.body)
    .then((data) => {
      if (data.response) {
        res.status(data.response.status).send(data.response.data);
      } else res.status(200).send(data);
    })
    .catch((e) => {
      res.status(403).send(e);
    });
});

app.post("/login", async function (req, res, next) {
  await request
    .post(process.env.authService + "/login", req.body)
    .then((data) => {
      if (data.response) {
        res.status(data.response.status).send(data.response.data);
      } else res.status(200).send(data);
    })
    .catch((e) => {
      res.status(403).send(e);
    });
});

app.post("/partner/register", async function (req, res, next) {
  await request
    .post(process.env.authService + "/partner/register", req.body)
    .then((data) => {
      if (data.response) {
        res.status(data.response.status).send(data.response.data);
      } else res.status(200).send(data);
    })
    .catch((e) => {
      res.status(403).send(e);
    });
});

app.post("/register", async function (req, res, next) {
  await request
    .post(process.env.authService + "/register", req.body)
    .then((data) => {
      if (data.response) {
        res.status(data.response.status).send(data.response.data);
      } else res.status(200).send(data);
    })
    .catch((e) => {
      res.status(403).send(e);
    });
});

app.post("/reset", async function (req, res, next) {
  await request
    .post(process.env.authService + "/reset", req.body)
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

app.post("/user/information", async function (req, res, next) {
  await request
    .post(process.env.authService + "/user/information", req.body)
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

app.get("/users/information", async function (req, res, next) {
  filters = JSON.parse(req.query.filters);
  console.log(filters);
  await request
    .get(process.env.authService + "/users/information", req.query)
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

app.post("/user/updateUser", async function (req, res, next) {
  await request
    .post(process.env.authService + "/user/updateUser", req.body)
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

module.exports = app;
