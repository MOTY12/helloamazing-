const moment = require("moment");
moment().format();
const mongoose = require('mongoose')
// const Joi = require("joi");

const userSchema = new mongoose.Schema({
    fName: {
        type: String
    },
    lName: {
        type: String
    },
    userName: {
        type: String,
        required: true,
        // unique: true,
    },
    Email: {
        type: String,
        unique: true,
        required: true,
    },

    DOB: {
        type: String
    },
    passwordHash: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
  passwordResetToken: { type: String, default: "" },
 
})


module.exports = mongoose.model('Users', userSchema)

