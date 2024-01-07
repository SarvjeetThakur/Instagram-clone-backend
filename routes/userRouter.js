const express = require('express')
const userRouter = express.Router()
const user_controller = require('../controllers/userController')

userRouter.post('/attempts-user',user_controller.userAttempt)
userRouter.post('/create-user',user_controller.userRegister)
userRouter.post('/verify-otp',user_controller.userRegister)

module.exports = userRouter