const express = require('express')
const router = express.Router()
module.exports = router

router.use('/api/v1/dashboard', require('@api/dashboard/dashboardRouter'))

router.use('/api/v1/item', require('@api/item/itemRoutes'))
router.use('/api/v1/itemIn', require('@api/itemIn/itemInRoutes'))
router.use('/api/v1/itemOut', require('@api/itemOut/itemOutRoutes'))
router.use('/api/v1/outcomeIn', require('@api/outcomeIn/outcomeInRoutes'))
router.use('/api/v1/outcome', require('@api/outcome/outcomeRoutes'))

router.use('/api/v1/transaction', require('@api/transaction/transactionRoutes'))
router.use(
    '/api/v1/detailTransaction',
    require('@api/detailTransaction/detailTransactionRoutes')
)

router.use('/api/v1/user', require('@api/user/userRoutes'))
router.use('/api/v1/member', require('@api/member/memberRoutes'))

router.use('/api/v1/status', require('@api/status/statusRoutes'))
router.use('/api/v1/service', require('@api/service/serviceRoutes'))
router.use('/api/v1/process', require('@api/process/processRoutes'))
router.use('/api/v1/salary', require('@api/salary/salaryRoutes'))
router.use('/api/v1/mreport', require('@api/mreport/mreportRoutes'))
router.use('/api/v1/mreportItem', require('@api/mreportItem/mreportItemRoutes'))
router.use('/api/v1/dreport', require('@api/dreport/dreportRoutes'))
router.use('/api/v1/rule', require('@api/rule/ruleRoutes'))
