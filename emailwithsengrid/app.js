const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');

/*app.get('/',(req,res) => {
    const msg = {
        to: 'ahanda205@gmail.com',
        from: 'ahanda206@hotmail.com', // Use the email address or domain you verified above
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
    sgMail.send(msg)
    res.send("msg send")
})*/

const msg = {
    to: 'ahanda205@gmail.com',
    from: 'ahanda206@hotmail.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };


  sgMail
  .send(msg)
  .then(() => {}, error => {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  });


