var express = require('express');
var app = express();
var Product = require('../classes/Product')

app.get('/', async (req, res) => {
  const product = new Product({})
  const data = await product.get(req.query.filters);
      if(data.length == 0 ){
        res.status(401).send("product not found")
    }else {
      console.log(data)
      res.send(data);
    }
  
});

app.get('/id', async (req, res) => {
  const product = new Product({})
  const data = await product.getByIds(req.query.filters);
  console.log(data)
  res.send(data);
  
});

app.post('/', async (req, res) => {
  const product = new Product({});
    let productExist = await product.get({name : req.body.name,idShop : req.body.idShop, idCateg : req.body.idCateg, isRemoved : false})
    if(productExist.length != 0){
        res.status(401).send("this product  already exists!")
    }else{
        const data = req.body
        data.isRemoved=false;
        const product = new Product(data)
        res.send(await product.post())
    }
});

app.patch('/', async (req, res) => {
  const data = req.body.data
  const filters = req.body.filters
  const product = new Product(data)

  res.send(await product.update(filters))


});
app.delete('/', async (req, res) => {
    const filters=req.body.filters
    const product = new Product({})
    res.send(await product.softDelete(filters));
});


module.exports = app;
