const express = require('express')
const verifyToken = require('@lib/verifyToken')
const router = express.Router()

const memberController = require('./memberController')

router.use(verifyToken)
router.get('/', memberController.index)
router.get('/:id', memberController.show)
// router.get('/search/:member_id', memberController.search)
router.post('/', memberController.store)
router.put('/:id', memberController.update)
router.delete('/:id', memberController.destroy)

module.exports = router
