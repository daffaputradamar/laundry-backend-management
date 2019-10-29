const mongoose = require('mongoose')

// process Schema
const processSchema = mongoose.Schema({
    process_name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
})

const Process = (module.exports = mongoose.model('Process', processSchema))
