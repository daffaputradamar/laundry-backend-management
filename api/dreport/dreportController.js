const Salary = require('@api/salary/salaryModel')
const Itemin = require('@api/itemIn/itemInModel')
const Outcome = require('@api/outcome/outcomeModel')
const Transaction = require('@api/transaction/transactionModel')

module.exports = {
    pemasukan: (req, res) => {
        let responseObject = {
            pemasukan: 0,
        }
        let { dateIn, dateOut } = req.query
        dateIn = new Date(dateIn)
        dateOut = new Date(dateOut)
        dateOut.setDate(dateOut.getDate() + 1)

        Transaction.aggregate([
            {
                $match: {
                    $and: [
                        {
                            dateIn: {
                                $gte: dateIn,
                            },
                        },
                        {
                            dateIn: {
                                $lte: dateOut,
                            },
                        },
                    ],
                },
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
                        'dayOfMonth(dateIn)': {
                            $dayOfMonth: '$dateIn',
                        },
                    },
                    'SUM(grandTotal)': {
                        $sum: '$grandTotal',
                    },
                },
            },
            {
                $project: {
                    year: '$_id.year(dateIn)',
                    month: '$_id.month(dateIn)',
                    dayOfMonth: '$_id.dayOfMonth(dateIn)',
                    totalPay: '$SUM(grandTotal)',
                },
            },
        ]).then(transactions => res.json(transactions))
        // .then(transactions => {
        //   responseObject.pemasukan = transactions[0].totalPay;
        //   return res.json(responseObject);
        // });
    },
    pengeluaran: (req, res) => {
        // let dateNow = new Date();
        let { dateIn, dateOut } = req.query
        dateIn = new Date(dateIn)
        dateOut = new Date(dateOut)
        dateOut.setDate(dateOut.getDate() + 1)

        let responseObject = {
            pemasukan: 0,
            pengeluaran: {
                salaries: [],
                items: [],
                outcomes: [],
            },
            laba: 0,
            keluar: 0,
            keluarItem: 0,
            keluarSalary: 0,
            KeluarOutcome: 0,
            bulan: 0,
            tahun: 0,
        }
        // Transaction.find()
        Transaction.aggregate([
            {
                $match: {
                    $and: [
                        {
                            dateIn: {
                                $gte: dateIn,
                            },
                        },
                        {
                            dateIn: {
                                $lte: dateOut,
                            },
                        },
                    ],
                },
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
                    },
                    'SUM(grandTotal)': {
                        $sum: '$grandTotal',
                    },
                },
            },
            {
                $project: {
                    year: '$_id.year(dateIn)',
                    month: '$_id.month(dateIn)',
                    totalPay: '$SUM(grandTotal)',
                },
            },
        ])
            .then(transactions => {
                //kita dapet hasil dari query sesuai di link tadi
                //kita filter yg bulan sekarang
                responseObject.pemasukan = transactions[0].totalPay

                return Itemin.aggregate([
                    {
                        $match: {
                            $and: [
                                {
                                    create_date: {
                                        $gte: dateIn,
                                    },
                                },
                                {
                                    create_date: {
                                        $lte: dateOut,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $group: {
                            _id: {
                                'month(create_date)': {
                                    $month: '$create_date',
                                },
                                'year(create_date)': {
                                    $year: '$create_date',
                                },
                                // item: "$item"
                            },
                            'SUM(price)': {
                                $sum: '$price',
                            },
                        },
                    },
                    {
                        $project: {
                            // item: "$_id.item",
                            year: '$_id.year(create_date)',
                            month: '$_id.month(create_date)',
                            bayar_barang: '$SUM(price)',
                        },
                    },
                ])
            })

            .then(itemins => {
                responseObject.pengeluaran.items = itemins
                return Salary.aggregate([
                    {
                        $match: {
                            $and: [
                                {
                                    create_date: {
                                        $gte: dateIn,
                                    },
                                },
                                {
                                    create_date: {
                                        $lte: dateOut,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $group: {
                            _id: {
                                'month(date)': {
                                    $month: '$create_date',
                                },
                                'year(date)': {
                                    $year: '$create_date',
                                },
                            },
                            'SUM(total)': {
                                $sum: '$total',
                            },
                        },
                    },
                    {
                        $project: {
                            year: '$_id.year(date)',
                            month: '$_id.month(date)',
                            paysalary: '$SUM(total)',
                        },
                    },
                ])
            })
            .then(salaries => {
                responseObject.pengeluaran.salaries = salaries
                return Outcome.aggregate([
                    {
                        $match: {
                            $and: [
                                {
                                    date: {
                                        $gte: dateIn,
                                    },
                                },
                                {
                                    date: {
                                        $lte: dateOut,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $group: {
                            _id: {
                                'month(date)': {
                                    $month: '$date',
                                },
                                'year(date)': {
                                    $year: '$date',
                                },
                            },
                            'SUM(total)': {
                                $sum: '$total',
                            },
                        },
                    },
                    {
                        $project: {
                            year: '$_id.year(date)',
                            month: '$_id.month(date)',
                            paysalary: '$SUM(total)',
                        },
                    },
                ])
            })
            .then(outcomes => {
                responseObject.pengeluaran.outcomes = outcomes

                responseObject.keluarItem =
                    responseObject.pengeluaran.items[0].bayar_barang

                responseObject.KeluarOutcome =
                    responseObject.pengeluaran.outcomes[0].paysalary

                responseObject.keluarSalary =
                    responseObject.pengeluaran.salaries[0].paysalary

                responseObject.keluar =
                    responseObject.pengeluaran.items[0].bayar_barang +
                    responseObject.pengeluaran.outcomes[0].paysalary +
                    responseObject.pengeluaran.salaries[0].paysalary

                // cara menghitung labanya gimana ? (pemasukan - pengeluaran), tapi kenapa hasil laba:null ?
                responseObject.laba =
                    responseObject.pemasukan -
                    (responseObject.pengeluaran.items[0].bayar_barang +
                        responseObject.pengeluaran.outcomes[0].paysalary +
                        responseObject.pengeluaran.salaries[0].paysalary)
                return res.json(responseObject)
            })
    },
    keluarItem: (req, res) => {
        let { dateIn, dateOut } = req.query
        dateIn = new Date(dateIn)
        dateOut = new Date(dateOut)
        dateOut.setDate(dateOut.getDate() + 1)
        Itemin.aggregate([
            {
                $match: {
                    $and: [
                        {
                            create_date: {
                                $gte: dateIn,
                            },
                        },
                        {
                            create_date: {
                                $lte: dateOut,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'items',
                    localField: 'item',
                    foreignField: '_id',
                    as: 'item',
                },
            },
            {
                $unwind: '$item',
            },

            {
                $group: {
                    _id: {
                        'month(create_date)': {
                            $month: '$create_date',
                        },
                        'year(create_date)': {
                            $year: '$create_date',
                        },
                        'dayOfMonth(create_date)': {
                            $dayOfMonth: '$create_date',
                        },
                        item: '$item',
                    },
                    'SUM(price)': {
                        $sum: '$price',
                    },
                },
            },
            {
                $project: {
                    year: '$_id.year(create_date)',
                    month: '$_id.month(create_date)',
                    dayOfMonth: '$_id.dayOfMonth(create_date)',
                    user: '$_id.item',
                    totalBuy: '$SUM(price)',
                },
            },
        ]).then(itemins => res.json(itemins))
    },
    keluarSalary: (req, res) => {
        let { dateIn, dateOut } = req.query
        dateIn = new Date(dateIn)
        dateOut = new Date(dateOut)
        dateOut.setDate(dateOut.getDate() + 1)
        Salary.aggregate([
            {
                $match: {
                    $and: [
                        {
                            create_date: {
                                $gte: dateIn,
                            },
                        },
                        {
                            create_date: {
                                $lte: dateOut,
                            },
                        },
                    ],
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
                $unwind: '$user',
            },

            {
                $group: {
                    _id: {
                        'month(create_date)': {
                            $month: '$create_date',
                        },
                        'year(create_date)': {
                            $year: '$create_date',
                        },
                        'dayOfMonth(create_date)': {
                            $dayOfMonth: '$create_date',
                        },
                        user: '$user',
                    },
                    'SUM(total)': {
                        $sum: '$total',
                    },
                },
            },
            {
                $project: {
                    year: '$_id.year(create_date)',
                    month: '$_id.month(create_date)',
                    dayOfMonth: '$_id.dayOfMonth(create_date)',
                    user: '$_id.user',
                    paySalary: '$SUM(total)',
                },
            },
        ]).then(salaries => res.json(salaries))
    },
    keluarOutcome: (req, res) => {
        let { dateIn, dateOut } = req.query

        dateIn = new Date(dateIn)
        dateOut = new Date(dateOut)
        dateOut.setDate(dateOut.getDate() + 1)
        console.log(req.query)
        console.log(dateIn)
        console.log(dateOut)
        Outcome.aggregate([
            {
                $match: {
                    $and: [
                        {
                            date: {
                                $gte: dateIn,
                            },
                        },
                        {
                            date: {
                                $lte: dateOut,
                            },
                        },
                    ],
                },
            },
            {
                $lookup: {
                    from: 'outcomeins',
                    localField: 'outcomein',
                    foreignField: '_id',
                    as: 'outcomein',
                },
            },
            {
                $unwind: '$outcomein',
            },

            {
                $group: {
                    _id: {
                        'month(date)': {
                            $month: '$date',
                        },
                        'year(date)': {
                            $year: '$date',
                        },
                        'dayOfMonth(date)': {
                            $dayOfMonth: '$date',
                        },
                        outcomein: '$outcomein',
                    },
                    'SUM(total)': {
                        $sum: '$total',
                    },
                },
            },
            {
                $project: {
                    outcomein: '$_id.outcomein',
                    year: '$_id.year(date)',
                    month: '$_id.month(date)',
                    dayOfMont: '$_id.dayOfMonth(date)',
                    paybill: '$SUM(total)',
                },
            },
        ]).then(outcomes => res.json(outcomes))
    },
}
