const mongoose = require('mongoose')

// Itemout Schema
const itemoutSchema = mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    create_date: {
        type: Date,
        default: Date.now(),
    },
})

const Itemout = (module.exports = mongoose.model('Itemout', itemoutSchema))
