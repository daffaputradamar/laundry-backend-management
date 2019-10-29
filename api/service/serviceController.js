const Service = require('./serviceModel')

module.exports = {
    show_service: (req, res) => {
        Service.find()
            .then(service => res.json(service))
            .catch(err => console.log(err))
    },
    index: (req, res) => {
        if (req.user.role == 'kasir' || req.user.role == 'admin') {
            Service.find()
                .then(service => res.json(service))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    show: (req, res) => {
        if (req.user.role == 'kasir' || req.user.role == 'admin') {
            Service.findById(req.params.id)
                .then(service => res.json(service))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    update: (req, res) => {
        if (req.user.role == 'admin') {
            Service.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            )
                .then(service => res.json(service))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    store: (req, res) => {
        if (req.user.role == 'admin') {
            Service.create({ ...req.body })
                .then(service => res.json(service))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    destroy: (req, res) => {
        if (req.user.role == 'admin') {
            Service.findOneAndDelete({ _id: req.params.id })
                .then(service => res.json(service))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
}
