const express = require('express');
const router = express.Router();
const Shop = require('../classes/Shop');

router.get('/', async (req, res) => {
  const shop = new Shop({})
  const data = await shop.get(req.query.filters);
  console.log(data)
  res.send(data);
});

router.post("/admin", async (req, res) => {
  const data = req.body;
  data.isRemoved = false;
  data.status = "active";
  data._createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  try {
    const shop = new Shop(data);
    const existingShop = await shop.get({ name: data.name });
    if (!existingShop.length) {
      res.send(await shop.post());
    } else {
      res.send('Name of the Shop already exists, please try another name');
    }
  } catch (e) {
    res.send(e);
  }
});


//transaction
router.patch('/admin/delete', async (req, res) => {
  const filters = req.body.filters;
  const shop = new Shop({})
  res.send(await shop.transaction(filters))
})


router.patch('/admin', async (req, res) => {
  const data = req.body.data
  const filters = req.body.filters
  data._updatedAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  const shop = new Shop(data)
  try {
    if (data.name) {
      console.log('Here')
      const existingShop = await shop.get({ name: data.name });
      if (existingShop.length === 0) {
        res.send(await shop.update(filters));
      } else {
        res.send('Name of the Shop already exists, please try another name');
      }
    } else {
      console.log('No name')
      res.send(await shop.update(filters));
    }
  } catch (e) {
    res.send(e)
  }
});



module.exports = router;
