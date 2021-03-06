const db = require('./dbController.js')
const {check, validationResult} = require('express-validator/check')
const {matchedData, sanitize} = require('express-validator/filter')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const adminPass = require('../instantiated/adminConfig.js')
var photosPath = '/../photos/'

// api here https://github.com/ctavan/express-validator
// and here https://github.com/chriso/validator.js

exports.create_user_post = [
    check('email', 'Invalid email')
        .trim().escape()
        .isEmail()
        .custom(value => {
            // 
            return db.findUserByEmail(value).then(user => {
                if (user.length != 0)
                    throw new Error('User with this email already registred')
            })
        })
    ,
    check('name.first', 'Invalid first name').trim().escape().isLength({min:1}).isAlpha('ru-RU'),
    check('name.last', 'Invalid last name').trim().escape().isLength({min:1}).isAlpha('ru-RU'),
    check('deathCode', 'DeathCode must be 4 numbers').trim().escape().isLength({min:4, max:4}).isNumeric(),
    check('vk', 'Vk can not be empty').trim().isLength({min:1}),
    check('course', 'Course can not be empty').trim().escape().isLength({min:1}),

    sanitize('email').trim().escape(),
    sanitize('name.first').trim().escape(),
    sanitize('name.last').trim().escape(),
    sanitize('deathCode').trim().escape(),
    sanitize('vk').trim(),
    sanitize('course').trim().escape(),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.mapped()})
        }
        const user = matchedData(req)
        if (req.body.admin == 'true') {
            if (req.body.adminPass != adminPass) {
                req.body.admin = false
            }
            else {
                user.deathCode = req.body.deathCode
                user.admin = req.body.admin
            }
        }
        db.createUser(user).then(() => res.sendStatus(200)).catch(() => res.sendStatus(500))
    }
]

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'photos/')
    },
    filename: (req, file, cb) => {
        cb(null, 'photo-' + Date.now() + path.extname(file.originalname))
    },
})

var upload = multer({
    storage: storage,
    limits: {filesize: 50 * 1024 * 1024},
    fileFilter: function(req, file, cb) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg') {
            return cb(new Error('Only .png and .jpeg allowed'))
        }
        cb(null, true)
    }
}).single('photo')

exports.update_user_photo = function (req, res) {
    if (!fs.existsSync('photos/')){
        fs.mkdirSync('photos/')
    }
    upload(req, res, (err) => {
        if (err || !req.file) return res.status(400).send('Invalid file. Only .png and .jpeg allowed')
        db.findUserById(req.body.id)
            .then((gotUser) => {
                if (gotUser == null) res.status(400).send('User not found')
                if (gotUser.photoState == 3) {
                    fs.unlink(__dirname + photosPath + req.file.filename, (err) => {
                        if (err) return res.status(500).send('Error deleting uploaded file, in already moderated case')
                        return res.status(400).send('Photo already passed moderation')
                    })
                }
                else {
                    if (fs.existsSync(__dirname + photosPath + gotUser.photo)) {
                        fs.unlinkSync(__dirname + photosPath + gotUser.photo)
                    }
                    db.updateUserById(req.body.id, {photo: req.file.filename})
                        .then(() => {
                            db.updateUserById(req.body.id, {photoState: 1}).then(() => {
                                return res.status(200).send('Photo succesfully updated')
                            })
                        }).catch((err) => {
                            fs.unlink(__dirname + photosPath + req.file.filename, () => {
                                return res.status(500).send(err)
                            })
                        })
                }
            }).catch(() => {
                fs.unlink(__dirname + photosPath + req.file.filename, () => {
                    return res.status(500)
                })
            })
    })
}

exports.authorize = function (req, res) {
    req.body.email = req.body.email.toLowerCase()
    db.getByEmailDeathcode(req.body.email, req.body.deathCode).then((user) => {
        if (user.length == 0) return res.status(400).send('No match')
        return res.status(200).send(user)
    })
}

// Not implemented yet
// exports.kill = function (req, res) {
// }
