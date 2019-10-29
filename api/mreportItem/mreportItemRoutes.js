const express = require('express')
const router = express.Router()

const mReportsItemController = require('./mreportItemController')
// router.get("/", index);
router.get('/pemasukan', mReportsItemController.pemasukan)
router.get('/item', mReportsItemController.keluarItem)
router.get('/outcome', mReportsItemController.keluarOutcome)
router.get('/outcome2', mReportsItemController.keluarOutcome2)
router.get('/salary', mReportsItemController.keluarSalary)

module.exports = router
