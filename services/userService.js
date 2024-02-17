const messages = require("../config/messageConfig");
const draftModel = require("../model/draftModel");
const postModel = require("../model/postModel");
const userModel = require("../model/userModel");
const { validationAttemp, checkExist, genrateJwtToken, resendOtpEmail, sendEmail, genrateSuggestUsernames, sendSMS, duplicateValidate, attemptProccess, verifyOtp, uploadOneImage } = require("../utils/common");
const { BAD_REQUST, SUCCESS } = require("../utils/statusHandle")
const bcrypt = require('bcrypt')

class userService {

    // logic function for attempt user for create account
    attemptUser = async (req, res) => {
        try {
            const { email, phone_number, user_name, full_name, password } = req.body
            if (email) {
                if (!user_name) {
                    const suggest_random = await genrateSuggestUsernames(email, 15)
                    return res.status(SUCCESS).send({ account_created: false, suggest_username: suggest_random, message: "draft!" })
                }

                else {
                    const validate_rule = validationAttemp({ user_name, full_name, password })
                    if (validate_rule) {
                        return res.status(BAD_REQUST).send({ message: validate_rule.message })
                    }
                    const attemp_process = await attemptProccess(email, phone_number, user_name, full_name, password)
                    if (!attemp_process.isValid) {
                        return res.status(BAD_REQUST).send({ message: attemp_process.message })
                    }
                    return res.status(SUCCESS).send({ message: attemp_process.message })
                }
            }
            else if (phone_number) {
                const validate_rule = validationAttemp({ user_name, full_name, password })
                if (validate_rule) {
                    return res.status(BAD_REQUST).send({ message: validate_rule.message })
                }
                await sendSMS(+917807600520, 'from anjali >>')
                return res.status(SUCCESS).send({ message: "message" })
            }
        } catch (error) {
            return res.status(BAD_REQUST).send({ error: error.message })
        }
    }

    // logic function for add user
    addUserService = async (req, res) => {
        try {
            const { email, phone_number, dob } = req.body
            const user_value = phone_number ? { phone_number } : (email ? { email } : (user_name ? { user_name } : ''))
            const exist_user = await checkExist(draftModel, user_value)
            if (!exist_user.isExist) {
                return res.status(BAD_REQUST).send({ message: messages.user.USER_NOT_FOUND })
            }
            const add_user = {
                email: exist_user?.exist?.email,
                phone_number: exist_user?.exist?.phone_number,
                user_name: exist_user?.exist?.user_name,
                password: exist_user?.exist?.password,
                dob: new Date(dob)
            }
            const curentTime = new Date()
            const timeDifference = curentTime.getTime() - exist_user?.exist?.createdAt.getTime();
            const minutesDifference = timeDifference / (1000 * 60);
            if (minutesDifference >= 15) {
                return res.status(SUCCESS).send({ message: messages.user.ACCOUNT_CREATED_EXPIRE_TIME })
            }
            await userModel.create(add_user)
            await draftModel.findByIdAndDelete(exist_user.exist?._id)
            return res.status(SUCCESS).send({ message: messages.user.USER_CREATED_SUCCESS_MESSAGE })
        } catch (error) {
            return res.status(BAD_REQUST).send({ error: error.message })
        }
    }

    // logic function for login
    loginUser = async (req, res) => {
        try {
            const { phone_number, email, user_name, password } = req.body
            const user_value = phone_number ? { phone_number } : (email ? { email } : (user_name ? { user_name } : ''))
            const exist_user = await checkExist(userModel, user_value)
            console.log("exist_user", user_value);
            if (!exist_user.isExist) {
                return res.status(BAD_REQUST).send({ message: messages.user.USER_NOT_FOUND })
            }
            if (exist_user.exist.password == password) {
                const token = genrateJwtToken(user_value.email, exist_user.exist.full_name)
                await userModel.findByIdAndUpdate(exist_user.exist._id, { user_token: token })
                return res.status(SUCCESS).send({ message: messages.user.LOGIN_SUCCESS_MESSAGE, token: token })
            }
            return res.status(BAD_REQUST).send({ message: messages.user.PASSWORD_NOT_MATCH_MESSAGE })
        } catch (error) {
            return res.status(BAD_REQUST).send({ error: error.message })
        }
    }

    // logic function for verify otp
    verifyOtpUserService = async (req, res) => {
        try {
            const { otp } = req.body
            const verify_otp = await verifyOtp(draftModel, req.params.id, otp)
            if (!verify_otp.valid) {
                return res.status(BAD_REQUST).send({ error: verify_otp.message })
            }
            console.log("verify_otp", verify_otp);
            return res.status(SUCCESS).send({ message: verify_otp.message })
        } catch (error) {
            return res.status(BAD_REQUST).send({ error: error.message })
        }
    }

    // logic function for update profile image
    uploadProfileIMageService = async (req, res) => {
        try {
            const uploadImage = await uploadOneImage(req.file.buffer, 'insta-clone')
            console.log("uploadImage", uploadImage);
            // await userModel.findByIdAndUpdate(req.params.id, { profile_img: uploadImage })
            return res.status(SUCCESS).send({ message: messages.user.PROFILE_UPDATE_SUCCESS_MESSAGE })
        } catch (error) {
            return res.status(BAD_REQUST).send({ error: error.message })
        }
    }

    // logic function for update bio
    updateBioService = async (req, res) => {
        try {
            const { bio_data, full_name, user_name } = req.body
            if (user_name) {
                const find_usernames = await userModel.findOne({ user_name: user_name })
                if (find_usernames) {
                    if (find_usernames._id != req.params.id) {
                        return res.status(BAD_REQUST).send({ message: messages.user.USER_NAME_ALREADY_MESSAGE })
                    }
                }
            }
            const update_detail = {
                bio_data: bio_data,
                full_name: full_name,
                user_name: user_name
            }
            await userModel.findByIdAndUpdate(req.params.id, { $set: { update_detail } })
            return res.status(SUCCESS).send({ message: messages.user.BIO_UPDATE_SUCCESS_MESSAGE })
        } catch (error) {
            return res.status(BAD_REQUST).send({ error: error.message })
        }
    }


    // logic function for update bio
    getUserService = async (req, res) => {
        try {
            const id = req.params.id
            const user_detail = await userModel.findById(id)
            return res.status(SUCCESS).send({ user_detail: user_detail })
        } catch (error) {
            return res.status(BAD_REQUST).send({ error: error.message })
        }
    }


    // logic function for update bio
    updatePersonalInformationService = async (req, res) => {
        try {
            const { bio_data, full_name, user_name } = req.body
            return res.status(SUCCESS).send({ user_detail: user_detail })
        } catch (error) {
            return res.status(BAD_REQUST).send({ error: error.message })
        }
    }

}

module.exports = userService 