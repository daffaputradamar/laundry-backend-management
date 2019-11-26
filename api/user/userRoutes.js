const express = require('express')
const router = express.Router()
const verifyToken = require('@lib/verifyToken')

const userController = require('./userController')

router.get('/', userController.index)
router.get('/:id', userController.show)
router.post('/', userController.store)
// router.post('/', verifyToken, userController.store)
router.post('/login', userController.authenticate)
router.put('/', verifyToken, userController.update)
// router.delete('/:id', userController.destroy)
router.delete('/:id', verifyToken, userController.destroy)

module.exports = router
