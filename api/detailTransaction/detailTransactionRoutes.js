const express = require('express')
const router = express.Router()
const verifyToken = require('@lib/verifyToken')
const detailTransactionController = require('./detailTransactionController')

router.get('/:id_trans', detailTransactionController.index)
router.get('/search/:invoice', detailTransactionController.searchByInvoice)
router.use(verifyToken)
router.post('/', detailTransactionController.store)
router.put('/:id', detailTransactionController.update)
router.delete('/:id', detailTransactionController.destroy)

module.exports = router
