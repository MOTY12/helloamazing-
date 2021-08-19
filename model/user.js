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
        // unique: true,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
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
    // token: {
    //     type: String,
    //     required: true
    // },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }

})


module.exports = mongoose.model('Users', userSchema)


// function validateEmail(input) {
//   const schema = Joi.object({
//     email: Joi.string().min(5).max(255).required().email(),
//   });

//   return schema.validate(input);
// }

// exports.validateEmail = validateEmail 
