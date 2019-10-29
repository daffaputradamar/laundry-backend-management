const mongoose = require('mongoose')

// Transaction Schema
const transactionSchema = mongoose.Schema({
    invoice: {
        type: String,
        unique: true,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    member: {
        type: Number,
        ref: 'Member',
        required: true,
    },
    dateIn: {
        type: Date,
        default: Date.now(),
    },
    dateOut: {
        type: Date,
        default: null,
    },
    discount: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        default: 0,
    },
    grandTotal: {
        type: Number,
        default: 0,
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Status',
        required: true,
    },
    recepient: {
        type: String,
        default: null,
    },
})

const Transaction = (module.exports = mongoose.model(
    'Transaction',
    transactionSchema
))
