const express = require('express')
const userRouter = express.Router()
const user_controller = require('../controllers/userController')

userRouter.post('/create-user',user_controller.userRegister)

module.exports = userRouter