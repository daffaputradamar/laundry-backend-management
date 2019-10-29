const Outcomein = require('./outcomeInModel')

module.exports = {
    index: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Outcomein.find()
                .then(outcomein => res.json(outcomein))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    show: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Outcomein.findById(req.params.id)
                .then(outcomein => res.json(outcomein))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    update: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Outcomein.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            )
                .then(outcomein => res.json(outcomein))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    store: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            let newOutcomein = { ...req.body }
            newOutcomein.user = req.user._id
            Outcomein.create(newOutcomein)
                .then(outcomein => res.json(outcomein))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    destroy: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Outcomein.findOneAndDelete({ _id: req.params.id })
                .then(outcomein => res.json(outcomein))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
}
