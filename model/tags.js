const mongoose = require('mongoose')
    // const Joi = require("joi");

const tagsSchema = new mongoose.Schema({
    tag: {
        type: String
    },

    dateCreated: {
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model('Tags', tagsSchema)
