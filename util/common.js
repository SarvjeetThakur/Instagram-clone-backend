const io = require("..")
const socketIO = require("socket.io")
const nodemailer = require('nodemailer')
const { SENDER_EMAIL, SENDER_EMAIL_PASS, MAX_OTP_CODE, MIN_OTP_CODE } = require("../config/constent")

const checkUniqueness = async (value, model, column) => {
    try {
        const exist = await model.findOne({ [column]: value })
        if (exist) {
            return true
        }
        else {
            return false
        }
    } catch (error) {
        return { error: error.message }
    }
}

const initWebSocket = (server) => {
    const io = socketIO(server, {
        cors: {
            origin: "*",

        }
    });
    io.on('connection', (socket) => {
        console.log('Client connected');

        // Handle incoming messages
        // socket.on('message', () => {
        //   console.log(`Received: ${message}`);

        //   // Broadcast the message to all clients
        //   io.emit('message', "message");
        // });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
    return io
}

const validationSantize = (validationRule) => {

}

async function sendEmail(to, subject, message) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: "anjalidhiman939@gmail.com",
                pass: "qtyocuqpdhwxxlvj"
            }
        })
        const notify = await transporter.sendMail({
            from: '"Instagram "',
            to: to,
            subject: subject,
            html: message
        })
        console.log("email sent with id:", notify.messageId);
        return true
    } catch (error) {
        return { error: error.message }
    }
}

function genrateOtp() {
    return Math.floor(Math.random() * (MAX_OTP_CODE - MIN_OTP_CODE + 1)) + MAX_OTP_CODE
}


async function resendOtpEmail(email) {
    try {
        const otp_code = genrateOtp();
        const subject_otp = "Verification from Insta!"
        const email_message = "Here is your otp for verification! <br><br><b>" + otp_code + "</b>"
        const mail = await sendEmail(email, subject_otp, email_message)
        if (mail) {
            return true
        }
        else {
            console.log("err", mail);
        }
    } catch (error) {
        return { error: error.message }
    }
}

module.exports = { checkUniqueness, initWebSocket, sendEmail, resendOtpEmail }
