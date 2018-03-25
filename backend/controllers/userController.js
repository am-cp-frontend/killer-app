const db = require('./dbController.js')
const {check, validationResult} = require('express-validator/check')
const {matchedData, sanitize} = require('express-validator/filter')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// api here https://github.com/ctavan/express-validator
// and here https://github.com/chriso/validator.js

exports.create_user_post = [
    check('email', 'Некорректный email')
        .trim().normalizeEmail().escape()
        .isEmail()
        .custom(value => {
            // 
            return db.findUserByEmail(value).then(user => {
                if (user.length != 0)
                    throw new Error('Пользователь с таким Email уже существует')
            })
        })
    ,
    check('name.first', 'Имя не может быть пустым').trim().escape().isLength({min:1}),
    check('name.last', 'Фамилия не может быть пустой').trim().escape().isLength({min:1}),
    check('deathCode', 'Код на убийство должен состоять из 4 цифр').trim().escape().isLength({min:4, max:4}).isNumeric(),
    
    //Нужно ли проверять курс?

    sanitize('email').trim().normalizeEmail().escape(),
    sanitize('name.first').trim().escape(),
    sanitize('name.last').trim().escape(),
    sanitize('deathCode').trim().escape(),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.mapped()})
        }
        const user = matchedData(req)
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
            console.log(file.mimetype)
            return cb(new Error('Only .png and .jpeg allowed'))
        }
        cb(null, true)
    }
}).single('photo')

var photosPath = '/../src/photos/'

exports.update_user_photo = function (req, res) {
    if (!fs.existsSync('photos/')){
        fs.mkdirSync('photos/')
    }
    upload(req, res, (err) => {
        if (err || !req.file) return res.status(400).send('Invalid file. Only .png and .jpeg allowed')
        db.findUserById(req.body._id)
            .then((gotUser) => {
                if (!gotUser.length) {
                    fs.unlink(__dirname + photosPath + req.file.filename, (err) => {
                        if (err) return res.status(500).send('Error deleting uploaded file, in no user find case')
                        return res.status(400).send('No user with this id')
                    })
                }
                if (gotUser.photoState == 3) {
                    fs.unlink(__dirname + photosPath + req.file.filename, (err) => {
                        if (err) return res.status(500).send('Error deleting uploaded file, in already moderated case')
                        return res.status(400).send('Photo already moderated')
                    })
                }
                db.updateUserById(req.body._id, {photo: req.file.filename})
                    .then(() => {
                        db.updateUserById(req.body._id, {photoState: 1}).then(() => {
                            return res.status(200).send('Photo succesfully updated')
                        })
                    }).catch((err) => {
                        fs.unlink(__dirname + photosPath + req.file.filename, () => {
                            return res.status(500).send(err)
                        })
                    })
            }).catch((err) => {
                fs.unlink(__dirname + photosPath + req.file.filename, () => {
                    return res.status(500).send(err)
                })
            })
    })
}

exports.shuffle = function (req, responce) {
    db.getRandomUserList().then((res) => {
        res[0].killerId = res[res.length - 1]
        res[0].victimId = res[1]
        res[res.length - 1].killerId = res[res.length - 2]
        res[res.length - 1].victimId = res[0]
        for (let i = 1; i < res.length - 1; i++) {
            res[i].killerId = res[i - 1]
            res[i].victimId = res[i + 1]
        }
        db.clearUsers().then(() => {
            db.rebuildCollection(res).then(() => {
                responce.status(200).send('Successfully shuffled')
            })
                .catch((err) => responce.status(500).send(err))
        })
    })
}

exports.authorize = function (req, res) {
    db.getByEmailDeathcode(req.body.email, req.body.deathCode).then((user) => {
        if (user.length == 0) return res.status(400).send('No user found')
        return res.status(200).send(user)
    })
}

exports.kill = function (req, res) {
    console.log(req.body._id)
    db.findUserById(req.body._id).then((user) => {
        console.log(user.victimId.email)
        res.status(200).send('Fuck yeah')
    }).catch(() => res.status(400).send('No user with this id'))
}