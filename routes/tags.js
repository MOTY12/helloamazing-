const express = require('express').Router
const tagSchema = require('../model/tags')
const router = express()


// get new training
router.get('/tag', async(req, res) => {
    const tagslist = await tagSchema.find().split("-").join(" ")
    if (!taglist) {
        res.status(500).json({
            message: "No author found "
        })
    }

    res.status(200).json({ data: taglist })
})


//insert new training
router.post('/tag', async(req, res) => {
    const tagField = new tagSchema({
        tag: req.body.tag
    })
    const fields = await tagField.save()
    if (!fields)
        return res.status(404).send({ message: 'Tag is not created' })

    res.send({ data: fields })

})


router.get('/tag/:id', async(req, res) => {
    const tagid = await tagSchema.findById(req.params.id)
    if (!tagid) {
        res.status(500).json({
            success: false,
            message: "No data for the tag requested"
        })
    }
    res.status(200).json({ data: tagid })
})



//delete author
router.delete('/tag/:id', async(req, res) => {
    const tag = await tagSchema.findByIdAndRemove(req.params.id)
        .then(tag => {
            if (tag) {
                return res.status(200).json({
                    success: true,
                    message: "Successfully deleted"
                })
            } else {
                return res.status(200).json({
                    success: false,
                    message: "the author cannot be found"
                })
            }
        }).catch(err => {
            return res.status(400).json({
                success: false,
                error: err
            })
        })
})







module.exports = router
