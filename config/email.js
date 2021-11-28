var nodemailer = require('nodemailer');
const dotenv = require('dotenv')
dotenv.config()

const senderEmail = process.env.EMAIL;
const senderPassword = process.env.PASS;


module.exports = function sendEmail(receiverEmail, userName, sender, subject, body) {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: 'gmail',
        port: 25,
        secure: true,
        auth: {
          user: senderEmail,
          pass: senderPassword
        },
        tls: {
            rejectUnauthorized: false
        }
      });

	let mailOptions = {
        from: sender,
        to: receiverEmail,
        subject: subject,
        text: body
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}




