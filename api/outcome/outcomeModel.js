const mongoose = require('mongoose')

// outcome Schema
const outcomeSchema = mongoose.Schema({
    outcomein: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Outcomein',
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    unit: {
        type: String,
    },
    qty: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
})

const Outcome = (module.exports = mongoose.model('Outcome', outcomeSchema))
