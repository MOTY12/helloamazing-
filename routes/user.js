const express = require('express')
    // const authpage = require('../helper/jwt');
const Users = require('../model/user')
const ejs = require('ejs')
const Token = require('../model/token')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const authjwtver = require('../helper/auth')
const nodemailer = require('nodemailer')
const crypto = require("crypto")
const { OAuth2Client } = require('google-auth-library');
const sgMail = require("@sendgrid/mail")
const sanitize = require("mongo-sanitize");
const moment = require('moment')
const Joi = require("joi");
const sendgridTransport = require('nodemailer-sendgrid-transport')
const router = express()
const path = require("path")


router.get(`/user`, async(req, res) => {
    const userList = await Users.find().select('-passwordHash -isAdmin -passwordResetToken -_id');

    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList);
})

router.get('/user/:id', async(req, res) => {
    const user = await Users.findById(req.params.id).select('-passwordHash -isAdmin -passwordResetToken -_id');

    if (!user) {
        res.status(500).json({ message: 'The user with the given ID was not found.' })
    }
    res.status(200).send(user);
})



router.get('/crosscheck', async(req, res) => {

    var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: "Gmail",
        port: "587",
        secure: false,
        auth: {
            user: process.env.USERNAME,
            pass: process.env.PASSWORD 
        }
    });
    var mailOptions = {
        to: 'mukhtarapril2000@gmail.com',
        subject: 'account verification',
        html: 'hello world confirmation mail',
    }
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            res.send(error);
        } else {
            res.send('done to work');
        }
    });
})

// router.get('/crosscheck', async(req, res) => {
//   const smtpTransport = nodemailer.createTransort({
//     host: 'smtp-relay.sendinblue.com',
//     post: 587,
//     auth: {
//         user: "mukhtarapril2000@gmail.com",
//         pass: "UBYDRcQv19W0C5t2",
//     }
//   })

//   const sendResult = await smtpTransport.sendMail({
//     from: 'mukhtarapril2000@gmail.com',
//     to: 'mukhtarapril8@gmail.com',
//     subject: 'account verification',
//     html: 'hello world confirmation mail',
//   })

// console.log(sendResult)        
//     })



//register user
router.post('/register', async(req, res) => {
    const user = new Users({
        fName: req.body.fName,
        lName: req.body.lName,
        userName: req.body.userName,
        Email: req.body.Email,
        DOB: req.body.DOB,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        isVerified: false,
        token: crypto.randomBytes(16).toString('hex')
    })
    user.save((err) => {
        if (err) {
//             console.log(err)
              if (err.name === 'MongoError') {
                    //  validation error
                    return res.status(401).json({ message: "User with this email already exist " })
                }
        } else {
            // create a token
            const token = new Token({
                _userId: user._id,
                token: crypto.randomBytes(16).toString("hex"),
            });

            // and store it for validation 12h expires
            const tokens = token.save()
                if (!tokens) {
                    return res.status(500).send("An unexpected error occurred");
                }
            
            var smtpTransport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: "Gmail",
        port: "587",
        secure: false,
        auth: {
            user: process.env.USERNAME,
            pass: process.env.PASSWORD 
        }
    });
    
            
            
                const mailOptions = {
                    from: 'mukhtarapril8@gmail.com',
                    to: `${user.Email}`,
                    subject: 'Account Email Verification',
                    html: `
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
  /**
   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
   */
  @media screen {
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
    }
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 700;
      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
    }
  }
  /**
   * Avoid browser level font resizing.
   * 1. Windows Mobile
   * 2. iOS / OSX
   */
  body,
  table,
  td,
  a {
    -ms-text-size-adjust: 100%; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
  }
  /**
   * Remove extra space added to tables and cells in Outlook.
   */
  table,
  td {
    mso-table-rspace: 0pt;
    mso-table-lspace: 0pt;
  }
  /**
   * Better fluid images in Internet Explorer.
   */
  img {
    -ms-interpolation-mode: bicubic;
  }
  /**
   * Remove blue links for iOS devices.
   */
  a[x-apple-data-detectors] {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    color: inherit !important;
    text-decoration: none !important;
  }
  /**
   * Fix centering issues in Android 4.4.
   */
  div[style*="margin: 16px 0;"] {
    margin: 0 !important;
  }
  body {
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  /**
   * Collapse table borders to avoid space between cells.
   */
  table {
    border-collapse: collapse !important;
  }
  a {
    color: #1a82e2;
  }
  img {
    height: auto;
    line-height: 100%;
    text-decoration: none;
    border: 0;
    outline: none;
  }
  </style>

</head>
<body style="background-color: #e9ecef;">

  <!-- start preheader -->
  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
    A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
  </div>
  <!-- end preheader -->

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- start logo -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
              <a href="#" target="_blank" style="display: inline-block;">
                <img src="" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
              </a>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end logo -->

    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end hero -->

    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">Hi ${user.fName},
                <br /><br />
                You have successfully register on HelloAmazing. To activate your account please click the Button below to confirm your email address.  
                  If you didn't create an account with <a href="https://blogdesire.com">HelloAmazing</a>, you can safely delete this email.</p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start button -->
          <tr>
            <td align="left" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="lightgreen" style="border-radius: 6px;">
                          <a href="https://helloamazing.herokuapp.com/helloAmazing/verify-email/${token.token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Confirm Email Address</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end button -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">Your link is active for 48 hours. After that, you will need to resend the verification email
                </p>
             </td>
          </tr>
          <!-- end copy -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
              <p style="margin: 0;">Cheers,<br> HelloAmazing</p>
            </td>
          </tr>
          <!-- end copy -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end copy block -->

    <!-- start footer -->
    <tr>
      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start permission -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
              <p style="margin: 0;">You received this email because you registered on HelloAmazing.
              If you wish to delete application or to stop receiving these mails, pleases do not click the link or you can safely delete this email.</p>
            </td>
          </tr>
          <!-- end permission -->

          <!-- start unsubscribe -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
              <p style="margin: 0;">If  you have any problems or need technical support, please contact us:<a href="#">HelloAmazing@gmail.com</a>.</p>
              
            </td>
          </tr>
          <!-- end unsubscribe -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end footer -->

  </table>
                    `
                }

          smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            res.send(error);
        } else {
            res.send({ message: "A verification mail has been sent." });
        }
    });  
            }
        
    })
})


router.get("/verify-email/:token", (req, res) => {
  // Find a matching token
  Token.findOne({ token: req.params.token }, function (err, token) {
    if (err) {
      return res.status(500).send("An unexpected error occurred");
    }
    if (!token)
      return res.status(404).send({
        message: "We were unable to find a valid token. Your token may have expired.",
      });

    // If we found a token, find a matching user
    Users.findById(token._userId, function (err, user) {
      if (err) {
        return res.status(500).send({ message: "An unexpected error occurred" });
      }

      if (!user)
        return res.status(404).send({ message: `We were unable to find a user for this token.` });

      if (user.isVerified)
        return res
          .status(400)
          .send({ message: "This user has already been verified. Please log in." });

      // Verify and save the user
      user.isVerified = true;
      user.expires = null;
      user.save(function (err) {
        if (err) {
          return res.status(500).send({ message: "An unexpected error occurred" });
        }
        return res.status(200).send({ message: "The account has been verified. Please log in." });
      });
    });
  });
});


//google login ito the application 
router.post('/googlelogin', (req, res) => {
    const client = new OAuth2Cilent(process.env.GOOGLE_CLIENT)
    const { idToken } = req.body;

    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
        .then(response => {
            // console.log('GOOGLE LOGIN RESPONSE',response)
            const { Email_verified, name, Email } = response.payload;
            if (Email_verified) {
                User.findOne({ Email }).exec((err, user) => {
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.secret, {
                            expiresIn: '7d'
                        });
                        const { _id, Email, name, role } = user;
                        return res.json({
                            token,
                            user: { _id, Email, name, role }
                        });
                    } else {
                        let password = Email + process.env.secret;
                        user = new User({ name, Email, password });
                        user.save((err, data) => {
                            if (err) {
                                console.log('ERROR GOOGLE LOGIN ON USER SAVE', err);
                                return res.status(400).json({
                                    error: 'User signup failed with google'
                                });
                            }
                            const token = jwt.sign({ _id: data._id },
                                process.env.JWT_SECRET, { expiresIn: '7d' }
                            );
                            const { _id, Email, name, role } = data;
                            return res.json({
                                token,
                                user: { _id, Email, name, role }
                            });
                        });
                    }
                });
            } else {
                return res.status(400).json({
                    error: 'Google login failed. Try again'
                });
            }
        });

})


//login user user => user.name === req.body.name
router.post('/login', async(req, res) => {
    const user = await Users.findOne({ Email: req.body.Email })
        // console.log(user)
    const secret = process.env.secret;
    if (!user) {
        return res.status(400).send({ msg: 'The Email address ' + req.body.Email + ' is not associated with any account. Check your Email address and try again' });
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
                userId: user._id,
                userName: user.userName,
                Email: user.Email
            },
            secret, { expiresIn: '1d' }
        )

        // Make sure the user has been verified
        if (!user.isVerified) return res.status(401).send({ type: 'not-verified', msg: 'Your account has not been verified.' });


        return res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }).status(200).json({ message: "Logged in successfully 😊 👌" });
    } else {
        res.status(400).send('password is wrong!');
    }

})

router.post("/forgotpassword", (req, res) => {
    const { Email } = req.body;
    Users.findOne({ Email }, function(err, user) {
        if (err || !user) {
            return res.status(500).send({ message: "An unexpected error occurred" });
        }
        if (!user) return res.status(404).send({ message: "No user found with this email address." });

        // Create a verification token
        var token = new Token({
            _userId: user._id,
            token: crypto.randomBytes(6).toString("hex"),
        });

        user.passwordResetToken = token.token;
        user.passwordResetExpires = moment().add(12, "hours");

        user.save(function(err) {
            if (err) {
                return res.status(500).send({ message: "An unexpected error occurred" });
            }
            // Save the token
            token.save(function(err) {
                if (err) {
                    return res.status(500).send({ message: "An unexpected error occurred" });
                }

                var smtpTransport = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    service: "Gmail",
                    port: "587",
                    secure: false,
                    auth: {
                        user: process.env.USERNAME,
                        pass: process.env.PASSWORD
                    }
                });

                // Send the mail
                const mailOptions = {
                    to: `${user.Email}`,
                    from: "mukhtarapril2000@gmail.com",
                    subject: "Reset Your HelloAmazing Password",
                    html: ` your forget password token is ${token.token}  
          `,
                };
                smtpTransport.sendMail(mailOptions, function(error, response) {
                    if (error) {
                        res.send(error);
                    } else {
                        res.send('done to work');
                    }
                });
            });
        });
    });
});

router.post("/resetpassword", async(req, res) => {
    Users.findOne({
        passwordResetToken: req.body.passwordResetToken
    }).then(user => {
        if (!user) {
            return res.status(422).json({ error: "This token is not valid. Your token may have expired." })
        }
        // Verify that the user token expires date has not been passed
        if (moment().utcOffset(0) > user.passwordResetExpires) {
            return res.status(400).send({
                message: "You cannot reset your password. The reset token has expired. Please go through the reset form again.",
            });
        }
        user.passwordHash = bcrypt.hashSync(req.body.passwordHash, 10);
        user.passwordResetToken = "";
        user.passwordResetExpires = moment().utcOffset(0);

        // Save updated user to the database
        user.save(function(err) {
            if (err) {
                return res.status(500).send({ message: "An unexpected error occurred" });
            }

            return res.status(200).send({ message: "Password has been successfully changed." });
        })
    })
});

//count all user in the system
router.get('/usercount', async(req, res) => {
    const countcandidate = await Users.countDocuments((count) => count)

    if (!countcandidate) {
        res.status(200).send('No Users Found in the system.')
    }
    res.status(500).send({ usercount: countcandidate })
        // console.log(countcandidate)
})      

router.get("/logout", authjwtver, (req, res) => {
    return res.clearCookie("access_token").status(200).json({ message: "Successfully logged out 😏 🍀" });
});


module.exports = router;
