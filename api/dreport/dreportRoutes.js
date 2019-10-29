const express = require('express')
const router = express.Router()

const dreportController = require('./dreportController')
// router.get("/", index);
router.get('/pemasukan', dreportController.pemasukan)
router.get('/item', dreportController.keluarItem)
router.get('/outcome', dreportController.keluarOutcome)
router.get('/salary', dreportController.keluarSalary)
router.get('/pengeluaran', dreportController.pengeluaran)

module.exports = router
