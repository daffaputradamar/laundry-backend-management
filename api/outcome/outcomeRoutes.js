const express = require('express')
const verifyToken = require('@lib/verifyToken')
const router = express.Router()

const outcomeController = require('./outcomeController')

router.use(verifyToken)
router.get('/', outcomeController.index)
router.get('/:id', outcomeController.show)
router.post('/', outcomeController.store)
router.put('/:id', outcomeController.update)
router.delete('/:id', outcomeController.destroy)

module.exports = router
