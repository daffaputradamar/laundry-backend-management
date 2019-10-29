const express = require('express')
const verifyToken = require('@lib/verifyToken')
const router = express.Router()

const itemInController = require('./itemInController')

router.use(verifyToken)
router.get('/', itemInController.index)
router.get('/:id', itemInController.show)
router.post('/', itemInController.store)
router.put('/:id', itemInController.update)
router.delete('/:id', itemInController.destroy)

module.exports = router
