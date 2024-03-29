const mongoose = require('mongoose')

const draftSchema = new mongoose.Schema({
    full_name: { type: String },
    user_name: { type: String },
    email: { type: String },
    phone_number: { type: Number },
    password: { type: String },
    otp: { type: String },
    is_deleted: { type: Boolean ,default:false}
},{timestamps:true})

const draftModel = mongoose.model('draft',draftSchema)

module.exports = draftModel