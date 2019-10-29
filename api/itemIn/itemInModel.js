const mongoose = require('mongoose')

// Itemin Schema
const iteminSchema = mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    create_date: {
        type: Date,
        default: Date.now(),
    },
})

const Itemin = (module.exports = mongoose.model('Itemin', iteminSchema))
