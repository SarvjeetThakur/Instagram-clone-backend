const userService = require("../services/userService")
const { PAGE_NOT_FOUND } = require("../utils/statusHandle")
const user_service = new userService()

module.exports.attempt = async (req, res) => {
    try {
        user_service.attemptUser(req,res)       //call the service for attempt for create accout
    } catch (error) {
        return res.status(PAGE_NOT_FOUND).send({ error: error.message })
    }
}

module.exports.addUser = async (req, res) => {
    try {
        user_service.addUserService(req,res)    //call the service for add user
    } catch (error) {
        return res.status(PAGE_NOT_FOUND).send({ error: error.message })
    }
}

module.exports.login = async (req, res) => {
    try {
        user_service.loginUser(req,res)     //call the service for login
    } catch (error) {
        return res.status(PAGE_NOT_FOUND).send({ error: error.message })
    }
}

module.exports.verifyOtpUser = async (req, res) => {
    try {
        user_service.verifyOtpUserService(req,res)  //call the service for verify otp
    } catch (error) {
        return res.status(PAGE_NOT_FOUND).send({ error: error.message })
    }
}


module.exports.uploadProfileIMage = async (req, res) => {
    try {
        user_service.uploadProfileIMageService(req,res)     //call the service for upload profile image
    } catch (error) {
        return res.status(PAGE_NOT_FOUND).send({ error: error.message })
    }
}


module.exports.updateBio = async (req, res) => {
    try {
        user_service.updateBioService(req,res)  //call the service for update bio
    } catch (error) {
        return res.status(PAGE_NOT_FOUND).send({ error: error.message })
    }
}

module.exports.getUser = async (req, res) => {
    try {
        user_service.getUserService(req,res)  //call the service for update bio
    } catch (error) {
        return res.status(PAGE_NOT_FOUND).send({ error: error.message })
    }
}


module.exports.updatePersonalInformation = async (req, res) => {
    try {
        user_service.updatePersonalInformationService(req,res)  //call the service for update bio
    } catch (error) {
        return res.status(PAGE_NOT_FOUND).send({ error: error.message })
    }
}