const mongoose = require('mongoose')


const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("Database connected successfully");
    } catch (e) {
        console.error("Database connection error:", e);
    }

}
dbConnect()