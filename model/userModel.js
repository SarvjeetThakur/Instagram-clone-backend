const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    full_name: { type: String },
    user_name: { type: String },
    email: { type: String },
    phone_number: { type: Number },
    password: { type: String },
    dob: { type: Date },
    otp: { type: Number },
    user_token: { type: String },
    profile_img: { type: String },
    bio: { type: String },
    account_type: { type: String, default: "normal" },
    is_deleted: { type: Boolean, default: false }
}, { timestamps: true })

const userModel = mongoose.model('user', userSchema)

module.exports = userModel