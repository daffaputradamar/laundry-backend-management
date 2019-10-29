const mongoose = require('mongoose')

// Service Schema
const serviceSchema = mongoose.Schema({
    serviceName: {
        type: String,
        required: true,
    },
    days: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    tarif: {
        type: Number,
        required: true,
    },
    create_date: {
        type: Date,
        default: Date.now(),
    },
})

const Service = (module.exports = mongoose.model('Service', serviceSchema))
