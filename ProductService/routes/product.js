var express = require('express');
var app = express();
var Product = require('../classes/Product')

app.get('/', async (req, res) => {
  const product = new Product({})
  const data = await product.get(req.query.filters);
  console.log(data)
  res.send(data);
  
});

app.get('/id', async (req, res) => {
  const product = new Product({})
  const data = await product.getByIds(req.query.filters);
  console.log(data)
  res.send(data);
  
});

app.post('/', async (req, res) => {
  const data = req.body
  data.isRemoved=false;
  const product = new Product(data)
  res.send(await product.post())
});

app.patch('/', async (req, res) => {
  const data = req.body.data
  const filters = req.body.filters
  const product = new Product(data)

  res.send(await product.update(filters))


});
app.delete('/', async (req, res) => {
    console.log(req.body.filters)
    const product = new Product({isRemoved:true})
    res.send(await product.update(req.body.filters))
});


module.exports = app;
