const express = require("express");
const router = express.Router();
const axios = require("axios");
const Shop = require("../classes/Shop");
const Categorie = require("../classes/Categorie");
router.post("/update", async (req, res) => {
  let data = req.body;
  let shop = new Shop({});
  let categorie = new Categorie({});
  const demanderShop = await shop.get({ _id: data.idShop });
  let categorieData = await categorie.getCat({ name: data.nameCat });
  let userId = demanderShop[0].idUser;
  console.log(demanderShop);
  let demande = {
    idUser: userId,
    type: data.type,
    categorie: categorieData[0]._id,
  };
  console.log(demande);

  await axios.post(
    process.env.DemandesService + "/demande/newDemande",
    demande
  );
  res.send(demanderShop);
});

module.exports = router;
