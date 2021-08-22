const express = require('express')
const Course = require('../model/course')
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
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

    // SEND FILE TO CLOUDINARY
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    // var adminId = req.userId

    try {

        const storage = multer.diskStorage({
            filename: (req, file, cb) => {
                const fileExt = file.originalname.split(".").pop();
                const filename = `${new Date().getTime()}.${fileExt}`;
                cb(null, filename);
            },
        });

        // Filter the file to validate if it meets the required audio extension
        const fileFilter = (req, file, cb) => {
            if (file.mimetype === "audio/mp3" || file.mimetype === "audio/mpeg") {
                cb(null, true);
            } else {
                cb({
                        message: "Unsupported File Format",
                    },
                    false
                );
            }
        };

        // Set the storage, file filter and file size with multer
        const upload = multer({
            storage,
            limits: {
                fieldNameSize: 200,
                fileSize: 5 * 1024 * 1024,
            },
            fileFilter,
        }).single("audio");

        // upload to cloudinary
        upload(req, res, (err) => {
            if (err) {
                return res.send(err);
            }

            const { path } = req.file; // file becomes available in req at this point

            const fName = req.file.originalname.split(".")[0];
            cloudinary.uploader.upload(
                path, {
                    resource_type: "raw",
                    public_id: `AudioUploads/${fName}`,
                },

                // Send cloudinary response or catch error
                (err, audio) => {
                    if (err) return res.send(err);

                    fs.unlinkSync(path);
                    const audiourl = audio.url

                    const course = new Course({
                        // AdminId: adminId,
                        title: req.body.title,
                        author: req.body.author,
                        description: req.body.description,
                        audiof: audiourl,
                        images: req.body.images
                    })


                    course.save((err, course) => {
                        if (err) {
                            console.log(err)
                        } else {
                            if (!course) {
                                res.send("Unsuccessfull!!!. pls try again later")
                            } else {
                                res.send(course)
                            }
                        }

                    });
                });
        })
    } catch (err) {
        console.log(err);
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


router.get('/searchcourse', (req, res, next) => {
    const thename = req.query.thename;
    Course.find({
        $or: [{
            "title": { '$regex': `${thename}`, $options: '$i' }
        }, { "author": { '$regex': `${thename}`, $options: '$i' } },
        { "tags": { '$regex': `${thename}`, $options: '$i' } }]
    }).then(data => { res.send(data) }).catch(err => {
        return res.status(400).json({
            success: false,
            error: err
        })
    });
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
