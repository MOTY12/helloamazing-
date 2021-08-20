const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  
    title: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    description: {
        type: String
    },
    audiof: {
        type: String
    },
    images: {
        type: String
    }

})


module.exports = mongoose.model('Course', courseSchema)
