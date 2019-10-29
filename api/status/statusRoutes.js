const express = require('express')
const verifyToken = require('@lib/verifyToken')
const router = express.Router()

const statusController = require('./statusController')

router.use(verifyToken)
router.get('/', statusController.index)
router.get('/:id', statusController.show)
router.post('/', statusController.store)
router.put('/:id', statusController.update)
router.delete('/:id', statusController.destroy)

module.exports = router
