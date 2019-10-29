const express = require('express')
const verifyToken = require('@lib/verifyToken')
const router = express.Router()

const processController = require('./processController')

router.use(verifyToken)
router.get('/', processController.index)
router.get('/:id', processController.show)
router.post('/', processController.store)
router.put('/:id', processController.update)
router.delete('/:id', processController.destroy)

module.exports = router
