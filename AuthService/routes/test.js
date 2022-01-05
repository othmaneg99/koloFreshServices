/*const jwt = require('jsonwebtoken')
var decodedToken = jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWNkZDQ5Y2RkNjBkY2Q2ZGI1YTU0NzQiLCJlbWFpbCI6Im5lcy5iYWhha2lAZ21haWwuY29tIiwicGhvbmUiOiIrMjEyNjI5MjMyOTgxIiwicGFzc3dvcmQiOiIkMmIkMDQkaWpHOFFRU1AvQkE3WVZianR6WUVmdXNvenhMNVRQWmJTQnFHLllQRmUuLmFCRWNJMHdnTEciLCJmaXJzdE5hbWUiOiJuZXNyaW5lIiwibGFzdE5hbWUiOiJiYWhha2kiLCJpc1JlbW92ZWQiOmZhbHNlLCJpYXQiOjE2NDA4NzkzODYsImV4cCI6MTY0MDkxNTM4Nn0.VohdsvZDIREYT9mnkjUY5rqi-IALJWrSu9pOzleAQ5Y');
console.log(decodedToken)
*/

"use strict";
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nessrine.bahaki@gmail.com',
    pass: ''
  }
});

var mailOptions = {
  from: 'nessrine.bahaki@gmail.com',
  to: 'n.bahaki@mundiapolis.ma',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});