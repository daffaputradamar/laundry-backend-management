const express = require('express')
const verifyToken = require('@lib/verifyToken')
const router = express.Router()

const salaryController = require('./salaryController')

router.use(verifyToken)
router.get('/', salaryController.index)
router.get('/:id', salaryController.show)
router.post('/', salaryController.store)
router.put('/:id', salaryController.update)
router.delete('/:id', salaryController.destroy)

module.exports = router
