const Transaction = require('@api/transaction/transactionModel')
const Detail = require('@api/detailTransaction/detailTransactionModel')

module.exports = {
    pemasukan: (req, res) => {
        Transaction.aggregate([
            {
                $lookup: {
                    from: 'status',
                    localField: 'status',
                    foreignField: '_id',
                    as: 'status',
                },
            },
            {
                $unwind: '$status',
            },
            {
                $group: {
                    _id: {
                        'month(dateIn)': {
                            $month: '$dateIn',
                        },
                        'year(dateIn)': {
                            $year: '$dateIn',
                        },
                        status: '$status',
                    },
                    'SUM(grandTotal)': {
                        $sum: '$grandTotal',
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    status: '$_id.status.status_name',
                    mount: '$count',
                    year: '$_id.year(dateIn)',
                    month: '$_id.month(dateIn)',
                    total: '$SUM(grandTotal)',
                },
            },
        ]).then(transactions => res.json(transactions))
    },
    layanan: (req, res) => {
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
                $unwind: '$service',
            },
            {
                $group: {
                    _id: { service: '$service' },
                    count: { $sum: 1 },
                },
            },

            {
                $project: {
                    service: '$_id.service.serviceName',

                    mount: '$count',
                },
            },
        ]).then(details => res.json(details))
    },
    proses: (req, res) => {
        Detail.aggregate([
            {
                $lookup: {
                    from: 'processes',
                    localField: 'process',
                    foreignField: '_id',
                    as: 'process',
                },
            },
            {
                $unwind: '$process',
            },
            {
                $group: {
                    _id: { process: '$process' },
                    count: { $sum: 1 },
                },
            },

            {
                $project: {
                    kode: '$_id.process.process_name',
                    mount: '$count',
                },
            },
        ]).then(salaries => res.json(salaries))
    },
}
