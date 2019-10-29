const express = require('express')
const verifyToken = require('@lib/verifyToken')
const router = express.Router()

const serviceController = require('./serviceController')

router.get('/show_service', serviceController.show_service)
router.use(verifyToken)

router.get('/', serviceController.index)
router.get('/:id', serviceController.show)
router.post('/', serviceController.store)
router.put('/:id', serviceController.update)
router.delete('/:id', serviceController.destroy)

module.exports = router
