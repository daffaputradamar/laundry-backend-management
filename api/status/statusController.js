const Status = require('./statusModel')

module.exports = {
    index: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Status.find()
                .then(status => res.json(status))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    show: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Status.findById(req.params.id)
                .then(status => res.json(status))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    update: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Status.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            )
                .then(status => res.json(status))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    store: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            let newStatus = { ...req.body }
            newStatus.user = req.user._id
            Status.create(newStatus)
                .then(status => res.json(status))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    destroy: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Status.findOneAndDelete({ _id: req.params.id })
                .then(status => res.json(status))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
}
