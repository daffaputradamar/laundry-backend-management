require('module-alias/register')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')

const dotenv = require('dotenv')
dotenv.config()

const router = require('@config/routes')
const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))
app.use(morgan('tiny'))

const db = require('@api/config/database').URL
let port = process.env.APP_PORT

//Mongo connect
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully...  :)'))
    .catch(err => console.log(err))

// Setting up the route app
app.use(router)
app.get('/', (req, res) => {
    res.send('It works')
})

// Run the app server
if (!module.parent) {
    app.listen(port, () => console.log(`Magic happen at ${port}`))
}

module.exports = app
