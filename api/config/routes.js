const express = require('express')
const router = express.Router()
module.exports = router

router.use('/api/v1/dashboard', require('@api/dashboard/dashboardRouter'))
router.use('/api/v1/item', require('@api/item/itemRoutes'))
router.use('/api/v1/service', require('@api/service/serviceRoutes'))

router.use('/api/v1/transaction', require('@api/transaction/transactionRoutes'))
router.use(
    '/api/v1/detailTransaction',
    require('@api/detailTransaction/detailTransactionRoutes')
)

router.use('/api/v1/mreportItem', require('@api/mreportItem/mreportItemRoutes'))
router.use('/api/v1/dreport', require('@api/dreport/dreportRoutes'))
router.use('/api/v1/rule', require('@api/rule/ruleRoutes'))
