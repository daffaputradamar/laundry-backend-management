const mongoose = require('mongoose')

// Itemout Schema
const salarySchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    create_date: {
        type: Date,
        default: Date.now(),
    },
})

const Salary = (module.exports = mongoose.model('Salary', salarySchema))
