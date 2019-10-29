const mongoose = require('mongoose')

//Rule Schema
const ruleSchema = mongoose.Schema({
    freqlow: {
        type: Number,
        required: true,
    },
    freqmiddle: {
        type: Number,
        required: true,
    },
    freqhigh: {
        type: Number,
        required: true,
    },
    kglow: {
        type: Number,
        required: true,
    },
    kgmiddle: {
        type: Number,
        required: true,
    },
    kghigh: {
        type: Number,
        required: true,
    },
    paylow: {
        type: Number,
        required: true,
    },
    paymiddle: {
        type: Number,
        required: true,
    },
    payhigh: {
        type: Number,
        required: true,
    },
    discountlow: {
        type: Number,
        required: true,
    },
    discountmiddle: {
        type: Number,
        required: true,
    },
    discounthigh: {
        type: Number,
        required: true,
    },
    create_date: {
        type: Date,
        default: Date.now(),
    },
})

const Rule = (module.exports = mongoose.model('Rule', ruleSchema))
