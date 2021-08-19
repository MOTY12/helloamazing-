const express = require('express')
const router = express()
    // const homepage = require('../views/homepage')

router.get('/', (req, res) => {
    res.render('homepage')
})


module.exports = router