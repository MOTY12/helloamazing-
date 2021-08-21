const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
// const authJwt = require('./helper/jwt');
const errorHandler = require('./helper/error-handler');
const passport = require('passport')
const cookieParser = require("cookie-parser");
const session = require('express-session')
const facebookStrategy = require('passport-facebook').Strategy
const dotenv = require('dotenv')
const app = express()

dotenv.config()

const apis = process.env.API_URL
const mongoURI = process.env.DBCONNECT

app.use(express.json())
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session())
app.use(session({ secret: "my-code-good-to-go" }))
app.set('view engine', 'ejs');
// app.use(authJwt());
app.use(errorHandler);


const usersRoutes = require('./routes/user')
const viewsRoutes = require('./routes/views')
const courseRoutes = require('./routes/course')

app.use(`${apis}`, usersRoutes)
app.use(`${apis}`, viewsRoutes)
app.use(`${apis}`, courseRoutes)


passport.use(new facebookStrategy({
        clientID: "1887953971342431",
        clientSecret: "f420ef3e02c1f8a74995d141dfd7a1e9",
        callbackURL: "http://localhost:3000/facebook/callback",
        profileFields: ['id', 'displayName', 'name', 'gender', 'picture.type(large)', 'email']

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        console.log(profile)
        return done(null, profile)
    }));

passport.serializeUser(function(user, done) {
    done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    return done(null, user)
});


app.get('/', (req, res) => {
    res.send('helo world')
})



app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email,user_photos' }));

app.get('/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect: '/profile',
        failureRedirect: '/failed'
    }));

app.get('/profile', (req, res) => {
    res.send("you are authenticated")
})

app.get('/failed', (req, res) => {
    res.send('you are non a valid user')
})



//configuring the database
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => { console.log('connected to the database') }).catch((err) => {
    // console.log('not connect to db')
    console.log(err)
})


app.listen(process.env.PORT || 4000)
