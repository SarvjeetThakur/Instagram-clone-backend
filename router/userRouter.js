const express = require('express')
const userRouter = express.Router()
const userController = require('../controllers/userController.js')
const { validationSantize } = require('../utils/common.js')
const { attemptValidationRule, loginValidationRule, createUserValidationRule, profileImageValidationRule, otpVerificationValidationRule, bioValidationRule, personalInformationValidationRule } = require('../utils/validationRule.js')
const authenticateUser = require('../middleware/authentication.js')
const multer = require('multer')
const upload = multer()

userRouter.post('/attempt', validationSantize(attemptValidationRule), userController.attempt)    //route for attempt for creating accoung
userRouter.post('/create-user', validationSantize(createUserValidationRule), userController.addUser)  // route for create user
userRouter.post('/login', validationSantize(loginValidationRule), userController.login)   // route for login
userRouter.post('/verify-otp/:id', validationSantize(otpVerificationValidationRule), userController.verifyOtpUser)    //route for verify otp
userRouter.post('/profile-image/:id', authenticateUser, upload.single('profile'), userController.uploadProfileIMage)    //route for update profile image
userRouter.put('/update-profile-detail/:id', authenticateUser, validationSantize(bioValidationRule), userController.updateBio) // route for update bio of user
userRouter.get('/user/:id', authenticateUser, userController.getUser) // route for get detail of single user
userRouter.put('/update-personal-detail/:id', authenticateUser, validationSantize(personalInformationValidationRule), userController.updatePersonalInformation) // route for get detail of single user


module.exports = userRouter