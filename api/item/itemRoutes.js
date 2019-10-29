const express = require('express')
const router = express.Router()
const verifyToken = require('@lib/verifyToken')

const itemController = require('./itemController')
router.get('/show_item/', itemController.index)
router.use(verifyToken)
router.get('/', itemController.index)
router.get('/:id', itemController.show)
router.post('/', itemController.store)
router.put('/:id', itemController.update)
router.delete('/:id', itemController.destroy)

module.exports = router
