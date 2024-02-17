const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    title_es_ES: { type: String },
    description_es_ES: { type: String },
    title_de: { type: String },
    description_de: { type: String },
}, { timestamps: true })

const postModel = mongoose.model('post', postSchema)

module.exports = postModel