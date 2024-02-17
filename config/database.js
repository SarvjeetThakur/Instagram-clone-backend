const mongoose = require('mongoose');
const messages = require('./messageConfig');

const url = process.env.MONGO_URI

mongoose.connect(url).then(() => {
    console.log(messages.database.DATABASE_CONNECT_MESSAGE);
}).catch((e) => {
    console.log(messages.database.DATABASE_CONNECT_ERROR + e);
})