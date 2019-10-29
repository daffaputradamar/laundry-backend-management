const Transaction = require('@api/transaction/transactionModel')
const Detail = require('@api/detailTransaction/detailTransactionModel')
const Member = require('@api/member/memberModel')

const shortid = require('shortid')
const axios = require('axios')

module.exports = {
    index: (req, res) => {
        Transaction.find()
            .populate('user')
            .populate('member')
            .populate('status')
            .then(transaction => res.json(transaction))
            .catch(err => console.log(err))
    },
    show: (req, res) => {
        Transaction.findById(req.params.id)
            .populate('user')
            .populate('member')
            .populate('status')
            .then(transaction => res.json(transaction))
            .catch(err => console.log(err))
    },
    search: (req, res) => {
        Transaction.find({ invoice: req.params.invoice })
            .populate('user')
            .populate('member')
            .populate('status')
            .then(transaction => res.json(transaction))
            .catch(err => console.log(err))
    },
    searchByPhone: (req, res) => {
        Member.findOne({ phone: req.params.phone })
            .then(member => {
                Transaction.find({ member: member._id })
                    .populate('user')
                    .populate('member')
                    .populate('status')
                    .then(transaction => res.json(transaction))
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    },
    searchByInvoice: (req, res) => {
        let { i } = req.query
        //console.log(req.query);
        Transaction.aggregate([
            {
                $lookup: {
                    from: 'members',
                    localField: 'member',
                    foreignField: '_id',
                    as: 'member',
                },
            },
            {
                $lookup: {
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'status',
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                },
            },

            {
                $unwind: '$member',
            },
            {
                $unwind: '$status',
            },
            {
                $unwind: '$user',
            },

            {
                $project: {
                    total: '$total',
                    discount: '$discount',
                    grandTotal: '$grandTotal',
                    invoice: '$invoice',
                    member: '$member.member_name',
                    user: '$user.name',
                    status: '$status.status_name',
                    phone: '$member.phone',
                    address: '$member.address',

                    d1: '$dateIn',
                    d2: '$dateOut',

                    year1: { $year: '$dateIn' },
                    month1: { $month: '$dateIn' },
                    day1: { $dayOfMonth: '$dateIn' },
                    minute1: { $minute: '$dateIn' },
                    hour1: { $hour: { $add: ['$dateIn', 7 * 60 * 60000] } },

                    year2: { $year: '$dateOut' },
                    month2: { $month: '$dateOut' },
                    day2: { $dayOfMonth: '$dateOut' },
                },
            },

            {
                $match: {
                    invoice: i,
                },
            },
        ]).then(transactions => res.json(transactions))
    },
    searchByTransaction: (req, res) => {
        let { i } = req.query
        //console.log(req.query);

        Detail.aggregate([
            {
                $lookup: {
                    from: 'services',
                    localField: 'service',
                    foreignField: '_id',
                    as: 'service',
                },
            },
            {
                $lookup: {
                    from: 'processes',
                    localField: 'process',
                    foreignField: '_id',
                    as: 'process',
                },
            },
            {
                $lookup: {
                    from: 'transactions',
                    localField: 'transaction',
                    foreignField: '_id',
                    as: 'transaction',
                },
            },
            {
                $unwind: '$service',
            },
            {
                $unwind: '$process',
            },
            {
                $unwind: '$transaction',
            },

            {
                $project: {
                    service: '$service.serviceName',
                    process: '$process.process_name',
                    transaction: '$transaction.invoice',
                    qty: '$qty',
                    tarif: '$service.tarif',
                    unit: '$service.unit',
                    price: {
                        $multiply: ['$qty', '$service.tarif'],
                    },
                    update: '$updatedAt',
                    year: { $year: '$updatedAt' },
                    month: { $month: '$updatedAt' },
                    day: { $dayOfMonth: '$updatedAt' },
                    hour_ori: { $hour: '$updatedAt' },
                    minute: { $minute: '$updatedAt' },
                    hour: { $hour: { $add: ['$updatedAt', 7 * 60 * 60000] } },
                },
            },
            {
                $match: {
                    transaction: i,
                },
            },
        ]).then(details => res.json(details))
    },
    hitung: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Transaction.findById(req.params.id)
                .then(transaction => {
                    Detail.find({ transaction: transaction._id })
                        .populate('service')
                        .then(details => {
                            let total = 0
                            //menambahkan dateout + hari sesuai service
                            let days = 0
                            details.forEach(detail => {
                                total += detail.qty * detail.service.tarif
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
                                            month: dateNow.getMonth() + 1,
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
                                            }/api/v1/rule/diskon?`,
                                            {
                                                params: {
                                                    f: transacts[0].count,
                                                    b: transacts[0].total,
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
                                                    res.json(transact)
                                                )
                                        })
                                })
                            })
                        })
                })
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    update: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Transaction.findOneAndUpdate(
                { _id: req.params.id },
                { $set: req.body },
                { new: true }
            )
                .then(transaction => res.json(transaction))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    store: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            let newTransact = { ...req.body }
            newTransact.user = req.user._id
            newTransact.invoice = shortid.generate()
            Transaction.create(newTransact)
                .then(transaction => res.json(transaction))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
    destroy: (req, res) => {
        if (req.user.role == 'admin' || req.user.role == 'kasir') {
            Transaction.findOneAndDelete({ _id: req.params.id })
                .then(transaction => res.json(transaction))
                .catch(err => console.log(err))
        } else {
            res.sendStatus(403)
        }
    },
}
