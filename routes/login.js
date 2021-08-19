const express = require('express')
    // const authpage = require('../helper/jwt');
const Schooladmin = require('../model/admin')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const authjwtver = require('../helper/auth')
const router = express()


router.get(`/user`, async(req, res) => {
    const userList = await Parent.find().select('-passwordHash');

    if (!userList) {
        res.status(500).json({ success: false })
    }
    res.send(userList);
})

router.get('/user/:id', async(req, res) => {
    const user = await Parent.findById(req.params.id).select('-passwordHash');

    if (!user) {
        res.status(500).json({ message: 'The user with the given ID was not found.' })
    }
    res.status(200).send(user);
})


//register parent
router.post('/schoolregister', async(req, res) => {
    const parent = new Schooladmin({
        schoollogo: req.body.schoollogo,
        schoolname: req.body.schoolname,
        schoolemail: req.body.schoolemail,
        phonenumber: req.body.phonenumber,
        address: req.body.address,
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10)
    })
    Schooladmin.findOne(parent.email).exec((err, parentdetails) => {
        if (parentdetails) {
            return res.status(400).json({ error: "User with this email already exist." })
        }
        parent.save((err, success) => {
            if (err) {
                //  return res.status(400).json({error: err})
                if (err.name === 'MongoError') {
                    //  validation error
                    return res.status(401).json({ message: "User with this email already exist " })
                }
            }
            res.json({ message: "Signup Success" })
        })
    })
})





//login user user => user.name === req.body.name

router.post('/login', async(req, res) => {
    const user = await Schooladmin.findOne({ schoolemail: req.body.schoolemail })
        // console.log(user)
    const secret = process.env.secret;
    if (!user) {
        return res.status(400).send('The user not found');
    }

    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
                userId: user._id,
                schoolname: user.schoolname,
                schoolemail: user.schoolemail,
                isAdmin: user.isAdmin
            },
            secret, { expiresIn: '1d' }
        )

        return res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        }).status(200).json({ message: "Logged in successfully 😊 👌" });


        // const decode = jwt_decode(token)
        // console.log(decode)
        // res.status(200).send({
        //     user: user.schoolname,
        //     user: user.schoolemail,
        //     token: token
        // })
    } else {
        res.status(400).send('password is wrong!');
    }


})


// router.get("/trythis", isAuth, (req, res) => {
//     res.send('hello come to ,e  world')
// })

router.post("forgetpassword", async(req, res) => {
    const apis = process.env.API_URL;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        Parent.findOne({ email: req.body.email }).then(user => {
            if (!user) {
                return res.status(422).json({ error: "User dont exists with that email" })
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000
            user.save().then((result) => {
                transporter.sendMail({
                    to: user.email,
                    from: "no-replay@insta.com",
                    subject: "password reset",
                    html: `
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="${api}/reset/${token}">link</a> to reset password</h5>
                    `
                })
                res.json({ message: "check your email" })
            })

        })
    })
})


//google login ito the application 
router.post('/googlelogin', (req, res) => {
    const client = new OAuth2Cilent(process.env.GOOGLE_CLIENT)
    const { idToken } = req.body;

    client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT })
        .then(response => {
            // console.log('GOOGLE LOGIN RESPONSE',response)
            const { email_verified, name, email } = response.payload;
            if (email_verified) {
                User.findOne({ email }).exec((err, user) => {
                    if (user) {
                        const token = jwt.sign({ _id: user._id }, process.env.secret, {
                            expiresIn: '7d'
                        });
                        const { _id, email, name, role } = user;
                        return res.json({
                            token,
                            user: { _id, email, name, role }
                        });
                    } else {
                        let password = email + process.env.secret;
                        user = new User({ name, email, password });
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
                            const { _id, email, name, role } = data;
                            return res.json({
                                token,
                                user: { _id, email, name, role }
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


router.get("/logout", authjwtver, (req, res) => {
    return res.clearCookie("access_token").status(200).json({ message: "Successfully logged out 😏 🍀" });
});


module.exports = router;