const { body, check, oneOf } = require("express-validator");

// validation rule for attempting for create accout
const attemptValidationRule = [
    oneOf([
        body('email').trim().notEmpty().withMessage('email required').isEmail().withMessage("Please enter email in valid format"),
        body('phone_number').trim().notEmpty().withMessage('phone_number required')
    ]),
    check('full_name').if(body('full_name').exists()).trim().isAlpha('en-US', { ignore: '\s' }).withMessage("Please enter full name in valid format"),
    check('password').if(body('password').exists()).trim().matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).withMessage('Password must have one uppercase letter, one lowercase letter, one number and one special character')
]

// validation rule for accout
const createUserValidationRule = [
    oneOf([
        body('email').trim().notEmpty().withMessage('email required').isEmail().withMessage("Please enter email in valid format"),
        body('phone_number').trim().notEmpty().withMessage('phone_number required').custom(value => {
            if (typeof value === 'string') {
                throw new Error('Field must not be a string');
            }
            return true;
        })
    ]),
    check('dob').trim().notEmpty().withMessage('Date of birth')
]

// validation rule for login
const loginValidationRule = [
    oneOf([
        body('email').trim().notEmpty().withMessage('email required').isEmail().withMessage("Please enter email in valid format"),
        body('phone_number').trim().notEmpty().withMessage('phone_number required').custom(value => {
            if (typeof value === 'string') {
                throw new Error('Field must not be a string');
            }
            return true;
        }),
        body('user_name').trim().notEmpty().withMessage('user_name required')
    ]),
    check('password').trim().not().isEmpty().withMessage('please enter the password').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/).withMessage('Password must have one uppercase letter, one lowercase letter, one number and one special character')

]

// validation rule for update profile image
const profileImageValidationRule = [
    oneOf([
        body('email').trim().notEmpty().withMessage('email required').isEmail().withMessage("Please enter email in valid format"),
        body('phone_number').trim().notEmpty().withMessage('phone_number required').custom(value => {
            if (typeof value === 'string') {
                throw new Error('Field must not be a string');
            }
            return true;
        }),
        body('user_name').trim().notEmpty().withMessage('user_name required')
    ]),
]

// validation rule for otp
const otpVerificationValidationRule = [
    body('otp').trim().notEmpty().withMessage('Otp Not Found')
]

// validation rule for profile updation
const bioValidationRule = [
    body('bio_data').trim().notEmpty().withMessage('Bio is required!'),
    body('full_name').trim().notEmpty().withMessage('Full name is required!'),
    body('user_name').trim().notEmpty().withMessage('User name is required!')
]

// validation rule for personal information updation
const personalInformationValidationRule = [
    oneOf([
        body('email').trim().notEmpty().withMessage('email required').isEmail().withMessage("Please enter email in valid format"),
        body('phone_number').trim().notEmpty().withMessage('phone_number required')
    ]),
    body('user_name').trim().notEmpty().withMessage('User name is required!')
]

module.exports = { attemptValidationRule, loginValidationRule, createUserValidationRule, profileImageValidationRule, otpVerificationValidationRule, bioValidationRule,personalInformationValidationRule }