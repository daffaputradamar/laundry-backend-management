const express = require('express')
const router = express.Router()
module.exports = router

router.use('/api/v1', require('@api/item/itemRoutes.js'))
router.use('/api/v1', require('@api/transaction/transactionRoutes.js'))
router.use('/api/v1', require('@api/service/transactionRoutes.js'))
router.use(
    '/api/v1',
    require('@api/detailTransaction/detailTransactionRoutes.js')
)
