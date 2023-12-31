const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const http = require("http")
const userRouter = require('./routes/userRouter')
const { initWebSocket } = require('./util/common')
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }));

const server = http.createServer(app);

const io = initWebSocket(server)
module.exports = io
app.use("/api", userRouter);

server.listen(process.env.PORT, () => {
  console.log("Server connected at port: " + process.env.PORT);
});

require('./database/database')
