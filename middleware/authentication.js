const jwt = require("jsonwebtoken");
const { UNAUTHORIZED, INVALID_TOKEN } = require("../utils/statusHandle");
const messages = require("../config/messageConfig");
const userModel = require("../model/userModel");


function authenticateUser(req, res, next) {
    const token = req.header('Authorization')
    if (!token) {
        return res.status(UNAUTHORIZED).json({ message: messages.token.MISSING_ERROR_MESSAGE })
    }
    jwt.verify(token, process.env.TOKEN_SECRET_KEY, async (err, user) => {
        if (err) {
            return res.status(INVALID_TOKEN).json({ message: "Invalid token" })
        }
        const user_detail = await userModel.findOne({ email: user.email })
        if (user_detail.user_token == token) {
            console.log("token valid");
        }
        next()
    }
    )
}

module.exports = authenticateUser