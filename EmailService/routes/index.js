var express = require("express");
var router = express.Router();
require("dotenv").config();
const mailjet = require("node-mailjet").connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

async function sendEmailGeneratedMDP(recipient, nomRecipient, password) {
  try {
    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "kolofreshservice@gmail.com",
            Name: "Kolo Fresh",
          },
          To: [
            {
              Email: recipient,
            },
          ],
          Subject: "KOLO FRESH | le mot de passe de votre shop",
          TemplateID: 3482161,
          TemplateLanguage: true,
          Variables: {
            nom: nomRecipient,
            MOT_PASSE: password,
          },
        },
      ],
    });
    return { status: 200, msg: "done" };
  } catch (err) {
    console.log(err);
    return { status: err.statusCode, msg: err.ErrorMessage };
  }
}

async function sendEmailNewPartner(
  nomPartner,
  phonePartner,
  nomRecipient,
  recipient
) {
  try {
    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "kolofreshservice@gmail.com",
            Name: "Kolo Fresh",
          },
          To: [
            {
              Email: recipient,
            },
          ],
          Subject: "KOLO FRESH | Nouveau partenaire",
          TemplateID: 3482157,
          TemplateLanguage: true,
          Variables: {
            nomAdmin: nomRecipient,
            nom: nomPartner,
            phone: phonePartner,
          },
        },
      ],
    });
    return { status: 200, msg: "done" };
  } catch (err) {
    console.log(err);
    return { status: err.statusCode, msg: err.ErrorMessage };
  }
}

async function sendEmailNewPassword(recipient, nomRecipient, password) {
  try {
    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "kolofreshservice@gmail.com",
            Name: "Kolo Fresh",
          },
          To: [
            {
              Email: recipient,
            },
          ],
          Subject: "KOLO FRESH | Réinitialisation du mot de passe",
          TemplateID: 3482158,
          TemplateLanguage: true,
          Variables: {
            nom: nomRecipient,
            password: password,
          },
        },
      ],
    });
    return { status: 200, msg: "done" };
  } catch (err) {
    console.log(err);
    return { status: err.statusCode, msg: err.ErrorMessage };
  }
}

async function sendEmailDemande(
  nomPartner,
  phonePartner,
  nomRecipient,
  recipient,
  subject,
  demande
) {
  try {
    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "kolofreshservice@gmail.com",
            Name: "Kolo Fresh",
          },
          To: [
            {
              Email: recipient,
            },
          ],
          Subject: "KOLO FRESH | " + subject,
          TemplateID: 3482154,
          TemplateLanguage: true,
          Variables: {
            nomAdmin: nomRecipient,
            nom: nomPartner,
            phone: phonePartner,
            demande: demande,
          },
        },
      ],
    });
    return { status: 200, msg: "done" };
  } catch (err) {
    console.log(err);
    return { status: err.statusCode, msg: err.ErrorMessage };
  }
}

async function sendEmailResDemande(
  nomRecipient,
  recipient,
  subject,
  decision,
  demande
) {
  try {
    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "kolofreshservice@gmail.com",
            Name: "Kolo Fresh",
          },
          To: [
            {
              Email: recipient,
            },
          ],
          Subject: "KOLO FRESH | " + subject,
          TemplateID: 3482159,
          TemplateLanguage: true,
          Variables: {
            nom: nomRecipient,
            decision: decision,
            demande: demande,
          },
        },
      ],
    });
    return { status: 200, msg: "done" };
  } catch (err) {
    console.log(err);
    return { status: err.statusCode, msg: err.ErrorMessage };
  }
}

router.post("/generateMDP", async function (req, res, next) {
  let result = await sendEmailGeneratedMDP(
    req.body.email,
    req.body.nom,
    req.body.password
  );
  res.send(result);
});

router.post("/newPartner", async function (req, res, next) {
  let result = await sendEmailNewPartner(
    req.body.nom,
    req.body.phone,
    req.body.nomAdmin,
    req.body.emailAdmin
  );
  res.send(result);
});

router.post("/newPassword", async function (req, res, next) {
  let result = await sendEmailNewPassword(
    req.body.email,
    req.body.nom,
    req.body.password
  );
  res.send(result);
});

router.post("/newNameShop", async function (req, res, next) {
  let result = await sendEmailDemande(
    req.body.nom,
    req.body.phone,
    req.body.nomAdmin,
    req.body.emailAdmin,
    "Demande de changement du nom du shop",
    "le changement de son nom de shop, le nouveau nom est " + req.body.newNom
  );
  res.send(result);
});

router.post("/newCatShop", async function (req, res, next) {
  let result = await sendEmailDemande(
    req.body.nom,
    req.body.phone,
    req.body.nomAdmin,
    req.body.emailAdmin,
    "Demande d'ajout d'une nouvelle catégorie",
    "l'ajout d'une nouvelle catégorie: " + req.body.newCategorie
  );
  res.send(result);
});

router.post("/resNewNameShop", async function (req, res, next) {
  let decision = req.body.decision ? "a accepté" : "a refusé";
  let result = await sendEmailResDemande(
    req.body.nom,
    req.body.email,
    "Réponse sur la demande de changement du nom du shop",
    decision,
    "de changement de votre nom du shop"
  );
  res.send(result);
});

router.post("/resNewCatShop", async function (req, res, next) {
  let decision = req.body.decision ? "a accepté" : "a refusé";
  let result = await sendEmailResDemande(
    req.body.nom,
    req.body.email,
    "Réponse sur la demande d'ajout d'une nouvelle catégorie",
    decision,
    "d'ajout d'une nouvelle catégorie"
  );
  res.send(result);
});

router.get("/contactstatistics", async function (req, res, next) {
  let email = req.query.Email ? req.query.Email : "";
  const request = await mailjet
    .get("contactstatistics/" + email, { version: "v3" })
    .request()
    .then((result) => {
      res.send(result.body);
    })
    .catch((err) => {
      res.send(err.statusCode);
    });
});

router.get("/geostatistics", async function (req, res, next) {
  const request = await mailjet
    .get("geostatistics", { version: "v3" })
    .request()
    .then((result) => {
      res.send(result.body);
    })
    .catch((err) => {
      res.send(err.statusCode);
    });
});

router.get("/listrecipientstatistics", async function (req, res, next) {
  const request = await mailjet
    .get("listrecipientstatistics", { version: "v3" })
    .request()
    .then((result) => {
      res.send(result.body);
    })
    .catch((err) => {
      res.send(err.statusCode);
    });
});

router.get("/toplinkclicked", async function (req, res, next) {
  const request = await mailjet
    .get("toplinkclicked", { version: "v3" })
    .request()
    .then((result) => {
      res.send(result.body);
    })
    .catch((err) => {
      res.send(err.statusCode);
    });
});

router.get("/useragentstatistics", async function (req, res, next) {
  const request = await mailjet
    .get("useragentstatistics", { version: "v3" })
    .request()
    .then((result) => {
      res.send(result.body);
    })
    .catch((err) => {
      res.send(err.statusCode);
    });
});

router.get("/listrecipientstatistics", async function (req, res, next) {
  const request = await mailjet
    .get("listrecipientstatistics", { version: "v3" })
    .request()
    .then((result) => {
      res.send(result.body);
    })
    .catch((err) => {
      res.send(err.statusCode);
    });
});

router.get("/listrecipientstatistics", async function (req, res, next) {
  const request = await mailjet
    .get("listrecipientstatistics", { version: "v3" })
    .request()
    .then((result) => {
      res.send(result.body);
    })
    .catch((err) => {
      res.send(err.statusCode);
    });
});

module.exports = router;
