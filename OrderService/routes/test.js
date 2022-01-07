"use strict";
const path = require('path')
const Handlebars = require('ejs')
var nodemailer = require('nodemailer')
const fs = require('fs')



// set the view engine to ejs
require('dotenv').config()

async function informerClient(idClient, numCommande,decisionCMD) {
      // envoi mail
      var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
          user: "kolofreshservice@gmail.com",
          pass: '@@kolofresh22'
          }
      });
      
        const templateStr = fs.readFileSync(path.join(__dirname, '../','views', 'test.ejs')).toString('utf8')
        const template = Handlebars.compile(templateStr, { noEscape: true })
        const html = template({numCommande: "1222325656", nomClient : idClient, decision : decisionCMD});
        let pathImg = path.join(__dirname, '../','views', 'kolofresh.png')
      //Inject the data in the template and compile the html
      var mailOptions = {
          from: "kolofreshservice@gmail.com",
          to:"nessrine.bahaki@gmail.com",
          subject: `KOLO FRESH | La commande N° ${numCommande}`,
          attachments: [{
            filename: 'kolofresh.png',
            path: pathImg,
            cid: 'logo' 
         }],
          html : html
      };

      transporter.sendMail(mailOptions, function(error, info){
          if (error) {
              console.log(error)
              return error
          } else {
              console.log('Email sent')
              return 'Email sent'
          }
      });
  }


informerClient("nesrine", "111111125415", "votre commande est bien reçues.")
