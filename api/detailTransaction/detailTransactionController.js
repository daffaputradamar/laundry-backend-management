const Detail = require('./detailTransactionModel')
const Transaction = require('@api/transaction/transactionModel')
const axios = require('axios')

module.exports = {
    index: (req, res) => {
        Detail.find({ transaction: req.params.id_trans })
            .populate('transaction')
            .populate('service')
            .populate('process')
            .then(detail => res.json(detail))
            .catch(err => console.log(err))
    },
    searchByInvoice: (req, res) => {
        Transaction.findOne({ invoice: req.params.invoice })
            .then(transaction => {
                Detail.find({ transaction: transaction._id })
                    .populate('transaction')
                    .populate('service')
                    .populate('process')
                    .then(detail => res.json(detail))
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    },

    update: (req, res) => {
        if (req.user.role == 'kasir' || req.user.role == 'admin') {
            Detail.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        updatedAt: new Date(),
                        process: req.body,
                        service: req.body,
                        qty: req.body,
                    },
                },

                { new: true }
            )
                .then(detail => res.json(detail))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },

    store: (req, res) => {
        if (req.user.role == 'kasir' || req.user.role == 'admin') {
            Detail.create({ ...req.body })
                .then(detail => {
                    Transaction.findById(detail.transaction).then(
                        transaction => {
                            Detail.find({ transaction: transaction._id })
                                .populate('service')
                                .then(details => {
                                    let total = 0
                                    let pay = 0
                                    pay = detail.qty * detail.service.tarif
                                    //menambahkan dateout + hari sesuai service
                                    let days = 0
                                    details.forEach(detail => {
                                        total +=
                                            detail.qty * detail.service.tarif
                                        if (detail.service.days > days) {
                                            days = detail.service.days
                                        }
                                    })
                                    //menambahkan dateout + hari sesuai service
                                    function addDays(date, days) {
                                        var result = new Date(date)
                                        result.setDate(result.getDate() + days)
                                        return result
                                    }
                                    transaction.dateOut = addDays(
                                        transaction.dateIn,
                                        days
                                    )
                                    transaction.total = total
                                    transaction.save().then(transaction => {
                                        let dateNow = new Date()
                                        Transaction.aggregate([
                                            {
                                                $addFields: {
                                                    month: {
                                                        $month: '$dateIn',
                                                    },
                                                    year: {
                                                        $year: '$dateIn',
                                                    },
                                                },
                                            },
                                            {
                                                $match: {
                                                    member: transaction.member,
                                                    month:
                                                        dateNow.getMonth() + 1,
                                                    year: dateNow.getFullYear(),
                                                },
                                            },
                                            {
                                                $group: {
                                                    _id: null,
                                                    total: {
                                                        $sum: '$total',
                                                    },
                                                    count: {
                                                        $sum: 1,
                                                    },
                                                },
                                            },
                                        ]).then(transacts => {
                                            console.log(transacts)
                                            axios
                                                .get(
                                                    `http://localhost:${
                                                        process.env.APP_PORT
                                                    }/api/v1/rules/diskon?`,
                                                    {
                                                        params: {
                                                            f:
                                                                transacts[0]
                                                                    .count,
                                                            b:
                                                                transacts[0]
                                                                    .total,
                                                        },
                                                    }
                                                )
                                                .then(response => {
                                                    transaction.discount =
                                                        response.data.diskon
                                                    transaction.grandTotal =
                                                        (transaction.total *
                                                            (100 -
                                                                transaction.discount)) /
                                                        100
                                                    transaction
                                                        .save()
                                                        .then(transact =>
                                                            res.json(detail)
                                                        )
                                                })
                                        })
                                    })
                                })
                        }
                    )
                })
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    destroy: (req, res) => {
        if (req.user.role == 'kasir' || req.user.role == 'admin') {
            Detail.findOneAndDelete({ _id: req.params.id })
                .then(detail => res.json(detail))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
}
