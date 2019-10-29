const mongoose = require('mongoose')

// ostatus Schema
const statusSchema = mongoose.Schema({
    status_name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
})

const Status = (module.exports = mongoose.model('Status', statusSchema))
