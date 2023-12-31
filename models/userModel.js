const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    full_name: { type: String },
    user_name: { type: String },
    email: { type: String },
    phone_number: { type: Number },
    password: { type: String },
    dob: { type: Date },
    is_deleted: { type: String }
})
const userModel = mongoose.model("user", userSchema)
module.exports = userModel