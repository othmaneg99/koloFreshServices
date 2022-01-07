"use strict";
var nodemailer = require('nodemailer'),
    fs = require('fs');
const path = require('path')
const ejs = require('ejs')
require('dotenv').config()

module.exports = async function (data) {
    console.log({nomClient : data.nomClient, emailClient : data.emailClient, numCommande : data.numCommande, decisionCMD : data.decisionCMD})
    // envoi mail
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    const templateStr = fs.readFileSync(path.join(__dirname, '../', 'views', 'email.ejs')).toString('utf8');
    const template = ejs.compile(templateStr, { noEscape: true });
    const html = template({ numCommande: data.numCommande, nomClient: data.nomClient, decision: data.decisionCMD });
    let pathImg = path.join(__dirname, '../', 'views', 'kolofresh.png');
    //Inject the data in the template and compile the html
    var mailOptions = {
        from: process.env.EMAIL,
        to: data.emailClient,
        subject: `KOLO FRESH | La commande N° ${data.numCommande}`,
        attachments: [{
            filename: 'kolofresh.png',
            path: pathImg,
            cid: 'logo'
        }],
        html: html
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return error;
        } else {
            console.log('Email sent');
            return 'Email sent';
        }
    });
}

