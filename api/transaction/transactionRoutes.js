const express = require('express')
const verifyToken = require('@lib/verifyToken')
const router = express.Router()

const transactionController = require('./transactionContoller')

router.get('/search/:invoice', transactionController.search)
router.get('/phone/:phone', transactionController.searchByPhone)

router.get('/transaksi', transactionController.searchByInvoice)
router.get('/bayar', transactionController.searchByTransaction)

router.get('/', transactionController.index)
router.get('/:id', transactionController.show)
router.use(verifyToken)
router.post('/', transactionController.store)
router.put('/hitung/:id', transactionController.hitung)
router.put('/:id', transactionController.update)
router.delete('/:id', transactionController.destroy)

module.exports = router
