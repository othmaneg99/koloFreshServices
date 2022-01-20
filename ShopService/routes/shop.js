const express = require("express");
const router = express.Router();
const axios = require("axios");
const Shop = require("../classes/Shop");
const app = require("../../DemandesService/routes/demande");

router.get("/", async (req, res) => {
  const shop = new Shop({});
  const data = await shop.get(req.query.filters);
  console.log(data);
  res.send(data);
});

router.post("/admin", async (req, res) => {
  const data = req.body;
  data.isRemoved = false;
  data.status = "active";
  data._createdAt = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");
  try {
    const shop = new Shop(data);
    const existingShop = await shop.get({ name: data.name });
    if (!existingShop.length) {
      let createdShop = await shop.post();
      let data = {
        token: req.body.token,
        idPartner: req.body.idUser,
      };
      await axios.post(
        process.env.AuthService + "authorisation/generateMDP",
        data
      );
      res.send(createdShop);
    } else {
      res.send("Name of the Shop already exists, please try another name");
    }
  } catch (e) {
    res.send(e);
  }
});

//transaction
router.patch("/admin/delete", async (req, res) => {
  const filters = req.body.filters;
  const shop = new Shop({});
  res.send(await shop.transaction(filters));
});

router.patch("/admin", async (req, res) => {
  const data = req.body.data;
  const filters = req.body.filters;
  data._updatedAt = new Date()
    .toISOString()
    .replace(/T/, " ")
    .replace(/\..+/, "");
  const shop = new Shop(data);
  try {
    if (data.name) {
      const existingShop = await shop.get({ name: data.name });
      if (existingShop.length === 0) {
        // ENVOI MAIL && Update demande
        let result = await shop.update(filters);
        await axios.patch(process.env.DemandesService + "/demande", {
          filters: { _id: req.body.data.idDemande, isRemoved: false },
          data: { status: "Accepted" },
        });
        let demande = await axios.get(
          process.env.DemandesService + "/demande",
          {
            params: {
              filters: { _id: req.body.data.idDemande, isRemoved: false },
            },
          }
        );
        let user = await axios.get(
          process.env.AuthService + "/users/information",
          {
            params: { _id: demande.data[0].idUser },
          }
        );
        await axios.post(process.env.EmailService + "/resNewNameShop", {
          nom: user.data.firstName + " " + user.data.lastName,
          email: user.data.email,
        });
        res.send(result);
      } else {
        res.send("Name of the Shop already exists, please try another name");
      }
    } else {
      console.log("No name");
      if (req.body.data.idDemande) {
        await axios.patch(process.env.DemandesService + "/demande", {
          filters: { _id: req.body.data.idDemande, isRemoved: false },
          data: { status: "Accepted" },
        });
        let demande = await axios.get(
          process.env.DemandesService + "/demande",
          {
            params: {
              filters: { _id: req.body.data.idDemande, isRemoved: false },
            },
          }
        );
        let user = await axios.get(
          process.env.AuthService + "/users/information",
          {
            params: { _id: demande.data[0].idUser },
          }
        );
        await axios.post(process.env.EmailService + "/resNewCatShop", {
          nom: user.data.firstName + " " + user.data.lastName,
          email: user.data.email,
        });
      }
      res.send(await shop.update(filters));
    }
  } catch (e) {
    res.send(e);
  }
});

router.post("/demande", async (req, res) => {
  // type && iduser
});

module.exports = router;
