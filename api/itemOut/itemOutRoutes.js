const express = require('express')

const verifyToken = require('@lib/verifyToken')
const router = express.Router()

const itemOutController = require('./itemOutController')

router.use(verifyToken)
router.get('/', itemOutController.index)
router.get('/:id', itemOutController.show)
router.post('/', itemOutController.store)
router.put('/:id', itemOutController.update)
router.delete('/:id', itemOutController.destroy)

module.exports = router
