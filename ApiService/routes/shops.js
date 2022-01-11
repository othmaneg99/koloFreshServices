const { default: axios } = require('axios');
var express = require('express');
const Request = require('../classes/Request');
var app = express();

/* GET users listing. */
const request = new Request()

app.get('/', async (req, res) => {
    filters = JSON.parse(req.query.filters)
    console.log(typeof(req.query.filters))
    console.log(filters.name)
    console.log(req.query)
    await request.get(process.env.shopService + '/shop', req.query).then((data) => {
        console.log(data)
        res.status(200).send(data)
});
});

// add new item
app.post('/admin', async (req, res) => {
  await request.post(process.env.shopService + '/shop/admin', req.body).then((data) => {
    console.log(data)
    res.status(200).send(data)
  }).catch((e) => {
    res.status(403).send(e)
  })
})
app.patch('/admin/delete', async (req, res) => {
    await request.update(process.env.shopService + '/shop/admin/delete', req.body).then((data) => {
      console.log(data)
      res.status(200).send(data)
    }).catch((e) => {
      res.status(403).send(e)
    })
  })



app.patch('/admin', async (req, res) => {
  await request.update(process.env.shopService + '/shop/admin', req.body).then((data) => {
    console.log(data)
    res.status(200).send(data)
  }).catch((e) => {
    res.status(403).send(e)
  })
})

app.delete('/', async (req, res) => {
  await request.delete(process.env.shopService + '/shop', {data: req.body}).then((data) => {
    console.log(data)
    res.status(200).send(data)
  }).catch((e) => {
    console.log(e)
    res.status(403).send(e)
  })
})
module.exports = app
