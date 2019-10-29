const express = require('express')
const verifyToken = require('@lib/verifyToken')
const router = express.Router()

const outcomeInController = require('./outcomeInController')

router.use(verifyToken)
router.get('/', outcomeInController.index)
router.get('/:id', outcomeInController.show)
router.post('/', outcomeInController.store)
router.put('/:id', outcomeInController.update)
router.delete('/:id', outcomeInController.destroy)

module.exports = router
