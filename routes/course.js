const express = require('express')
const Course = require('../model/course')
const router = express()

router.get("/courses", async(req, res) => {
    const courses = await Course.find()
    res.json(courses)
    if (!courses) {
        res.json({ message: "No course found" })
    }
})

router.get("/course/:id", async(req, res) => {
    const courses = await Course.findById(req.params.id)
    if (!courses) {
        res.status(500).json({ msg: "ooh sorry!!!. the course is not available" })
    }
    res.status(200).json(courses)
})
router.post("/course", async(req, res) => {
    var adminId = req.userId
    const course = new Course({
        AdminId: adminId,
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        audiof: req.body.audiof,
        image: req.body.image
    })
    const courses = await course.save()

    if (!courses) {
        res.send("Unsuccessfull!!!. pls try again later")
    } else {
        res.send(courses)
    }


    // res.send('hello world')
})

router.put("/updatecourse/:id", async(req, res) => {
    const updatecourse = await Course.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        audiof: req.body.audiof,
        image: req.body.image
    }, {
        new: true
    })
    const updatecourses = await updatecourse.save()


    if (!updatecourses) {
        res.status(500).json({ msg: "Unsuccessful Update... Pls try again later" })
    } else {
        res.send(updatecourses)
    }
})

router.delete('/deletecourse', async(req, res) => {
    const courses = await Course.findByIdAndRemove(req.params.id)
        .then(courses => {
            if (courses) {
                return res.status(200).json({
                    success: true,
                    message: "The course cannot be found"
                })
            } else {
                return res.status(200).json({
                    success: false,
                    message: "oh!!.... the course cannot be found"
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