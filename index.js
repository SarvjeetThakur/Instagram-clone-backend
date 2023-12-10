const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')
const userRouter = require('./routes/userRouter')
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use("/api", userRouter);

app.listen(process.env.PORT, () => {
    console.log("Server connected at port: " + process.env.PORT);
  });

require('./database/database')

