const mongoose = require('mongoose')

const parentSchema = new mongoose.Schema({
    schoollogo: {
        type: String
    },
    schoolname: {
        type: String
    },
    schoolemail: {
        type: String,
        unique: true,
    },
    phonenumber: {
        type: String
    },
    address: {
        type: String
    },
    passwordHash: {
        type: String
    },
    // resetToken: String,
    // expireToken: Date,
    isAdmin: {
        type: Boolean,
        default: true
    }
    // role: {
    //     type: String,
    //     default: 'Admin'
    //         //    // enum:["admin","user"]
    // }
})

module.exports = mongoose.model('Parent', parentSchema)