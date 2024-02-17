const { validationResult } = require("express-validator");
const { BAD_REQUST, SUCCESS } = require("./statusHandle");
const draftModel = require("../model/draftModel");
const jwt = require('jsonwebtoken')
// const accountSid = 'AC8c0257713e224603a6a94eedcd47a03d';
// const authToken = '0cb108f00a6fb43c55ec9f2d3c1fa8d1';
// const client = require('twilio')(accountSid, authToken);
const { v4: uuidv4 } = require('uuid');
const userModel = require("../model/userModel");
const bcrypt = require('bcrypt');
const { MAX_USERNAME_CODE, MIN_USERNAME_CODE } = require("../config/constent");
const nodemailer = require('nodemailer')

const accountSid = "AC8c0257713e224603a6a94eedcd47a03d";
const authToken = "0cb108f00a6fb43c55ec9f2d3c1fa8d1";
const verifySid = "VA24544340eee69c1ec5bc97145e581cc3";
const client = require("twilio")(accountSid, authToken);


const cloudinary = require('../config/cloudinaryConfig.js')
const streamifier = require('streamifier')



function validationAttemp(obj) {
  for (const key in obj) {
    if (!obj[key]) {
      return { isValid: false, message: `${key} is required!` }
    }
  }
}

function validationSantize(validationRules) {
  return [
    ...validationRules,
    async (req, res, next) => {
      const errors = validationResult(req);
      const firstError = errors.array({ onlyFirstError: true });
      if (!errors.isEmpty()) {
        return res.status(BAD_REQUST).json({ errors: firstError });
      }
      next();
    },
  ];
}

async function checkExist(model, value) {
  const exist = await model.findOne(value)
  if (exist) {
    return { isExist: true, exist }
  }
  else {
    return { isExist: false, exist }
  }
}

function genrateJwtToken(email, full_name) {
  try {
    const token = jwt.sign({ email: email, full_name: full_name }, process.env.TOKEN_SECRET_KEY)
    return token
  } catch (error) {
    return null
  }
}

function genrateOtp() {
  const otp_code = Math.floor(Math.random() * (MAX_USERNAME_CODE - MIN_USERNAME_CODE + 1)) + MIN_USERNAME_CODE;
  return otp_code.toString().padStart(4, '0');
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

async function resendOtpEmail(model, id, email) {
  try {
    const otp_code = genrateOtp();
    const subject_otp = "Verification from Insta!"
    const email_message = "Here is your otp for verification! <br><br><b>" + otp_code + "</b>"
    const mail = await sendEmail(email, subject_otp, email_message)
    if (mail) {
      await model.findByIdAndUpdate(id, { otp: otp_code })
      console.log("id", id);
      return true
    }
    else {
      console.log("err", mail);
    }
  } catch (error) {
    return { error: error.message }
  }
}

const genrateSuggestUsernames = async (email, length) => {
  try {
    const usernames = []
    for (let i = 0; i < length; i++) {
      const random_num = uuidv4().substr(0, 3);
      const username_base = email.split('@')[0]
      const username = username_base + random_num
      const check_unique = await userModel.findOne({ user_name: username })
      if (check_unique) {
        console.log("check_unique", check_unique);
      }
      usernames.push(username)
    }
    return usernames
  } catch (error) {
    return { error: error.message }
  }
}


async function sendSMS(phoneNumber, message) {
  try {
    // Download the helper library from https://www.twilio.com/docs/node/install
    // Set environment variables for your credentials
    // Read more at http://twil.io/secure

    // client.verify.v2
    //   .services(verifySid)
    //   .verifications.create({ to: "+917807600520", channel: "sms" })
    //   .then((verification) => console.log(verification.status))
    //   .then(() => {
    //     const readline = require("readline").createInterface({
    //       input: process.stdin,
    //       output: process.stdout,
    //     });
    //     readline.question("Please enter the OTP:", (otpCode) => {
    client.verify.v2
      .services(verifySid)
      .verificationChecks.create({ to: "+917807600520", code: 15232 })
      .then((verification_check) => console.log(verification_check.status))
      .then(() => readline.close());
    // });
    // });
    return true
    // const result = await client.messages.create({
    //   body: message,
    //   from: +918699189818,
    //   to: phoneNumber
    // });

    // console.log('SMS sent successfully:', result.sid);
    // return true;
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    return false;
  }
}

async function duplicateValidate(model, values) {
  try {
    for (const key in values) {
      if (values[key]) {
        const exist_feild = await model.findOne({ [key]: values[key] })
        if (exist_feild != null) {
          console.log(`${key} is already exist!`);
          return { isValid: false, message: `${key} is already exist!` }
        }
      }
    }
  } catch (error) {
    return false
  }
}

async function attemptProccess(email, phone_number, user_name, full_name, password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const encode_pass = await bcrypt.hash(password, salt)
    const check_draft = await duplicateValidate(draftModel, { email, phone_number, user_name, full_name })
    if (check_draft) {
      return { isValid: false, message: check_draft.message }
      return res.status(BAD_REQUST).send({ message: check_draft.message })
    }
    const check_exist = await duplicateValidate(userModel, { email, phone_number, user_name, full_name })
    if (check_exist) {
      console.log("check_exist", check_exist);
      return { isValid: false, message: check_exist.message }
      return res.status(BAD_REQUST).send({ message: check_exist.message })
    }
    const create_draft = {
      email: email ? email : "",
      phone_number: phone_number ? phone_number : "",
      user_name: user_name,
      full_name: full_name,
      password: encode_pass
    }
    const draft_rec = await draftModel.create(create_draft)
    const otp = await resendOtpEmail(draftModel, draft_rec._id, email)
    if (otp) {
      return { isValid: true, message: "Please check your email for varification code!" }
      return res.status(SUCCESS).send({ message: "Please check your email for varification code!" })
    }
    else {
      return { isValid: false, message: "Error while sending otp" }
      return res.status(BAD_REQUST).send({ message: "Error while sending otp" })
    }
  } catch (error) {
    return false
  }
}

async function verifyOtp(model, id, otp) {
  try {
    const verify = await model.findById(id, { otp: 1 })
    if (verify.otp) {
      if (verify.otp == otp) {
        console.log(verify.otp, otp);
        return { valid: true, message: "Verification Success" }
      }
    }
    return { valid: false, message: "Verification Failed" }
  } catch (error) {
    return false
  }
}

async function uploadOneImage(buffer, folder_name) {
  const streamUpload = (buffer, folder) => {
    return new Promise((resolve, reject) => {
      let stream = cloudinary.uploader.upload_stream(
        {
          folder: folder
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      streamifier.createReadStream(buffer).pipe(stream);
    });
  }

  const result = await streamUpload(buffer, folder_name)
  console.log("result", result);
  return result.secure_url
}

module.exports = { validationAttemp, validationSantize, checkExist, genrateJwtToken, resendOtpEmail, sendEmail, genrateSuggestUsernames, sendSMS, duplicateValidate, attemptProccess, verifyOtp, uploadOneImage }