var express = require('express');
var router = express.Router();
require('dotenv').config()
const mailjet = require("node-mailjet").connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

async function sendEmailGeneratedMDP(recipient, nomRecipient, password) {
  try {
    const result = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: "nessrine.bahaki@gmail.com",
              Name: "nesrine",
            },
            To: [
              {
                Email: recipient,
              },
            ],
            Subject: "KOLO FRESH | le mot de passe de votre shop",
            TemplateID: 3481945,
            TemplateLanguage: true,
            Variables: {
              nom : nomRecipient,
        MOT_PASSE: password
        
        }        
      },
        ],
      });
    return {status : 200,msg : 'done'}
  } catch (err) {
    console.log(err);
    return {status : err.statusCode, msg : err.ErrorMessage}
  }
}




/* GET users listing. */
router.post('/generateMDP', async function(req, res, next) {
  let result = await sendEmailGeneratedMDP(req.body.email, req.body.nom,req.body.password);
  res.status(result.status).send(result.msg);
});

router.get('/contactstatistics', async function(req,res,next) {
  let email =req.query.Email? req.query.Email:""
const request = await mailjet
	.get("contactstatistics/"+email, {'version': 'v3'})
	.request()
	.then((result) => {
		res.send(result.body)
	})
	.catch((err) => {
		res.send(err.statusCode)
	})
})

router.get('/geostatistics', async function(req,res,next) {
const request = await mailjet
	.get("geostatistics", {'version': 'v3'})
	.request()
	.then((result) => {
		res.send(result.body)
	})
	.catch((err) => {
		res.send(err.statusCode)
	})
})


router.get('/listrecipientstatistics', async function(req,res,next) {
  const request = await mailjet
    .get("listrecipientstatistics", {'version': 'v3'})
    .request()
    .then((result) => {
      res.send(result.body)
    })
    .catch((err) => {
      res.send(err.statusCode)
    })
  })

  
router.get('/toplinkclicked', async function(req,res,next) {
  const request = await mailjet
    .get("toplinkclicked", {'version': 'v3'})
    .request()
    .then((result) => {
      res.send(result.body)
    })
    .catch((err) => {
      res.send(err.statusCode)
    })
  })

  
router.get('/useragentstatistics', async function(req,res,next) {
  const request = await mailjet
    .get("useragentstatistics", {'version': 'v3'})
    .request()
    .then((result) => {
      res.send(result.body)
    })
    .catch((err) => {
      res.send(err.statusCode)
    })
  })

  
router.get('/listrecipientstatistics', async function(req,res,next) {
  const request = await mailjet
    .get("listrecipientstatistics", {'version': 'v3'})
    .request()
    .then((result) => {
      res.send(result.body)
    })
    .catch((err) => {
      res.send(err.statusCode)
    })
  })

  
router.get('/listrecipientstatistics', async function(req,res,next) {
  const request = await mailjet
    .get("listrecipientstatistics", {'version': 'v3'})
    .request()
    .then((result) => {
      res.send(result.body)
    })
    .catch((err) => {
      res.send(err.statusCode)
    })
  })
  
module.exports = router;
