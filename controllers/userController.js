const userService = require("../services/userService")
const user_service = new userService()

module.exports.userAttempt = async (req, res) => {
    try {
        user_service.attemptService(req,res)
    } catch (error) {
        return res.status(404).send({ error: error.message })
    }
}

module.exports.userRegister = async (req, res) => {
    try {
        user_service.registerService(req,res)
    } catch (error) {
        return res.status(404).send({ error: error.message })
    }
}