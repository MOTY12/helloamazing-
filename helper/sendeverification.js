const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const jwt = require('jsonwebtoken')

const transport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY
    })
);

const sendConfirmationEmail = async(user) => {
    emailToken = await jwt.sign({
        user: user._id,
    }, process.env.secret)

    transport.sendMail({
        from: 'helloamazingapp@gmail.com',
        to: `${user.Fname} <${user.Email}>`,
        subject: 'Account Verification Token',
        text: `Hello, Thank for registering on our site.
         plsease copy and paste the address beow to verify your account
         http://localhost:3000/helloAmazing/verify-email?token=${emailToken}`,
        html: `
         <h1>Hello,</h1>
         <p>Thanks for registering on our site.</p>
         <p>please click the link below to verify your account.</p>
         <a href="http://localhost:3000/helloAmazing/verify-email?token=${emailToken}">verify your account</a>
         `
    }).then(() => {
        console.log("email Sent")
    }).catch((err) => {
        console.log(err)
    })
}

exports.sendConfirmationEmail = sendConfirmationEmail