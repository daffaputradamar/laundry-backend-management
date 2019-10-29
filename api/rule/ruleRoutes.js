const express = require('express')
const verifyToken = require('@lib/verifyToken')
const router = express.Router()

const ruleController = require('./ruleController')

router.get('/diskon', ruleController.diskon)
router.use(verifyToken)
router.get('/', ruleController.index)
router.get('/:id', ruleController.show)
router.post('/', ruleController.store)
router.put('/:id', ruleController.update)
router.delete('/:id', ruleController.destroy)

module.exports = router
