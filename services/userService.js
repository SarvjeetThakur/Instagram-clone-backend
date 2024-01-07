const userModel = require("../models/userModel")
const bcrypt = require('bcrypt')
const {checkUniqueness} = require("../util/common")
const messages = require("../config/messageConfig")
const io = require("..")

class userService {
    registerService = async (req, res) => {
        try {
            const { user_name, full_name, email, phone_no, password } = req.body
            if (email) {
                const exist_email = await checkUniqueness(email, userModel, email)
                if (exist_email) {
                    return res.status(403).send({ message: messages.user.EMAIL_ALREADY_EXIST_MESSAGE })
                }
            }
            const salt = await bcrypt.genSalt(10);
            const encode_pass = await bcrypt.hash(password, salt)
            const user = {
                user_name: user_name,
                full_name: full_name ? full_name : "",
                email: email ? email : "",
                phone_no: phone_no ? phone_no : "",
                password: password
            }
            io.emit("message","sarvmessage")
            await userModel.create(user)
            return res.status(200).send({ message: "user register successfully!" })
        } catch (error) {
            return res.status(404).send({ error: error.message })
        }
    }
}

module.exports = userService