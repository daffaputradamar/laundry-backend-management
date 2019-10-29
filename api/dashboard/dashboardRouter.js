const express = require('express')
const router = express.Router()

const dashboardController = require('./dashboardController')
router.get('/pemasukan', dashboardController.pemasukan)
router.get('/layanan', dashboardController.layanan)
router.get('/proses', dashboardController.proses)

module.exports = router
