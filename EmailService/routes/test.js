const mailjet = require ('node-mailjet')
.connect('e99d714077450c5398ea490b4295a8fd', '7d738c8660b93b42dd770d02c7291032')
const request = mailjet
.post("send", {'version': 'v3.1'})
.request({
  "Messages":[
    {
      "From": {
        "Email": "nessrine.bahaki@gmail.com",
        "Name": "nesrine"
      },
      "To": [
        {
          "Email": "nesrine.bahaki@gmail.com",
          "Name": "nesrine"
        }
      ],
      "Subject": "Greetings from Mailjet.",
      "TextPart": "My first Mailjet email",
      "HTMLPart": "<h3>Dear passenger 1, welcome to <a href='https://www.mailjet.com/'>Mailjet</a>!</h3><br />May the delivery force be with you!",
      "CustomID": "AppGettingStartedTest"
    }
  ]
})
request
  .then((result) => {
    console.log(result.body)
  })
  .catch((err) => {
    console.log(err)
  })
