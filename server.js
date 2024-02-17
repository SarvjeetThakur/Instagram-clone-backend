const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
dotenv.config()
const mainRouter = require('./router/mainRouter.js')
const database = require('./config/database')
const app = express()
const apicache = require('apicache')

const cache = apicache.middleware

app.use(cors({
    origin: "*"
}));
app.use(express.json())

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use('/api/v1',mainRouter)
app.listen(process.env.PORT, () => { console.log(`server connected at ${process.env.PORT} `); })