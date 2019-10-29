const Itemout = require('./itemOutModel')
const Item = require('@api/item/itemModel')

module.exports = {
    index: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Itemout.find()
                .populate('item')
                .then(itemout => res.json(itemout))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    show: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Itemout.findById(req.params.id)
                .populate('item')
                .then(itemout => res.json(itemout))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    update: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Itemout.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            )
                .then(itemout => res.json(itemout))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    store: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            let stock, stockout
            Item.findById(req.body.item)
                .then(item => {
                    stock = item.stock
                    stockout = req.body.qty
                    if (stock < stockout) {
                        // res.sendStatus(400);
                        res.status(400).send(
                            'stok kurang dari jumlah yang diminta, stok' +
                                ' ' +
                                item.item_name +
                                '  :' +
                                stock
                        )
                    } else {
                        Itemout.create({ ...req.body }).then(itemout => {
                            item.stock = stock - stockout
                            item.save().then(() => res.json(itemout))
                        })
                    }
                })

                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    destroy: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Itemout.findOneAndDelete({ _id: req.params.id })
                .then(itemout => res.json(itemout))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
}
