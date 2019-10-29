const express = require('express')
const router = express.Router()

const mreportController = require('./mreportController')
router.get('/pemasukan', mreportController.pemasukan)
router.get('/item', mreportController.keluarItem)
router.get('/outcome', mreportController.keluarOutcome)
router.get('/outcome2', mreportController.keluarOutcome2)
router.get('/salary', mreportController.keluarSalary)
router.get('/pengeluaran', mReportsItemController.pengeluaran)

module.exports = router
