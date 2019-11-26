const User = require('./userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

module.exports = {
    index: (req, res) => {
        User.find()
            .then(user => res.json(user))
            .catch(err => console.log(err))
    },
    show: (req, res) => {
        User.findById(req.params.id)
            .then(user => res.json(user))
            .catch(err => console.log(err))
    },
    authenticate: (req, res) => {
        const { username, password } = req.body
        User.findOne({ username })
            .then(user => {
                if (!user) {
                    res.sendStatus(403)
                }
                bcrypt
                    .compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            userId = user._id
                            jwt.sign(
                                { userId },
                                `${process.env.JWT_SECRET}`,
                                (err, token) => {
                                    if (err) {
                                        res.sendStatus(403)
                                    }
                                    // res.json({ token });
                                    res.json({ token, user })
                                }
                            )
                        } else {
                            res.sendStatus(403)
                        }
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    },
    update: (req, res) => {
        User.findOneAndUpdate(
            { _id: req.user._id },
            { $set: req.body },
            { new: true }
        )
            .then(user => res.json(user))
            .catch(err => console.log(err))
    },
    store: (req, res) => {
        // if (req.user.role == 'admin') {
        let newUser = req.body
        bcrypt.genSalt(10, function(err, salt) {
            if (err) throw err
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                if (err) throw err
                newUser.password = hash
                User.create(newUser)
                    .then(user => res.json(user))
                    .catch(err => console.log(err))
            })
        })
        // } else {
        //     res.sendStatus(403)
        // }
    },
    destroy: (req, res) => {
        if (req.user.role == 'admin') {
            User.findOneAndDelete({ _id: req.params.id })
                .then(user => res.json(user))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
}
