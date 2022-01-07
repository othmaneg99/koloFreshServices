var express = require('express');
var router = express.Router();
let envoiEmail = require('./envoiEmail.js');

/* GET home page. */
router.get('/', async function(req, res, next) {
  await envoiEmail({nomClient : "nesrine ", emailClient : 'nessrine.bahaki@gmail.com', numCommande : "155466", decisionCMD : "bien reçues"})
  res.send('done');
});
module.exports = router;
