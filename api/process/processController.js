const Process = require('./processModel')

module.exports = {
    index: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Process.find()
                .then(process => res.json(process))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    show: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Process.findById(req.params.id)
                .then(process => res.json(process))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    update: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Process.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            )
                .then(process => res.json(process))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },

    store: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            let newProcess = { ...req.body }
            newProcess.user = req.user._id
            Process.create(newProcess)
                .then(process => res.json(process))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    destroy: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Process.findOneAndDelete({ _id: req.params.id })
                .then(process => res.json(process))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
}
