const jwt = require('jsonwebtoken')
const User = require('@api/user/userModel')

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1]
        jwt.verify(token, `${process.env.JWT_SECRET}`, (err, payload) => {
            if (err) {
                res.sendStatus(403)
            }
            User.findById(payload.userId)
                .then(user => {
                    req.user = user
                    next()
                })
                .catch(err => res.sendStatus(403))
        })
    } else {
        res.sendStatus(403)
    }
}

module.exports = verifyToken
