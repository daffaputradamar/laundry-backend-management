const Outcome = require('./outcomeModel')

module.exports = {
    index: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Outcome.find()
                .populate('user')
                .populate('outcomein')
                .then(outcome => res.json(outcome))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    show: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Outcome.findById(req.params.id)
                .populate('user')
                .populate('outcomein')
                .then(outcome => res.json(outcome))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    update: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Outcome.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            )
                .then(outcome => res.json(outcome))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    store: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            let newOutcome = { ...req.body }
            newOutcome.user = req.user._id
            Outcome.create(newOutcome)
                .then(outcome => res.json(outcome))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    destroy: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Outcome.findOneAndDelete({ _id: req.params.id })
                .then(outcome => res.json(outcome))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
}
