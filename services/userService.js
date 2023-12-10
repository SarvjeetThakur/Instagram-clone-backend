const userModel = require("../models/userModel")
const bcrypt = require('bcrypt')

class userService {
    registerService = async (req, res) => {
        try {
            const { user_name, full_name, email, phone_no, password } = req.body
            const salt = await bcrypt.genSalt(10);
            const encode_pass = await bcrypt.hash(password,salt)
            const user = {
                user_name: user_name,
                full_name: full_name ? full_name : "",
                email: email ? email : "",
                phone_no: phone_no ? phone_no : "",
                password: password
            }
            await userModel.create(user)
            return res.status(200).send({ message: "user register successfully!" })
        } catch (error) {
            return res.status(404).send({ error: error.message })
        }
    }
}

module.exports = userService