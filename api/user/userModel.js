const mongoose = require('mongoose')

// User Schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
    },

    role: {
        type: String,
        enum: ['admin', 'kasir'],
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    create_date: {
        type: Date,
        default: Date.now(),
    },
})

const User = (module.exports = mongoose.model('User', userSchema))
