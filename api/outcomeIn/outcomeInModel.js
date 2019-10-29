const mongoose = require('mongoose')

// outcomein Schema
const outcomeinSchema = mongoose.Schema({
    outcomein_name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
})

const Outcomein = (module.exports = mongoose.model(
    'Outcomein',
    outcomeinSchema
))
