const messages = {
    database :{
        DATABASE_CONNECT_MESSAGE:"Database connected successfully",
        DATABASE_CONNECT_ERROR : "Database not connected"
    },
    user:{
        USER_NOT_FOUND:"User not found!",
        USER_CREATED_SUCCESS_MESSAGE:"User created successfully!",
        ACCOUNT_CREATED_EXPIRE_TIME:"Account created time is expire!",
        PASSWORD_NOT_MATCH_MESSAGE:"Password not match!",
        LOGIN_SUCCESS_MESSAGE:"Login Successfully!",
        BIO_UPDATE_SUCCESS_MESSAGE:"Bio updated successfully!",
        PROFILE_UPDATE_SUCCESS_MESSAGE:"profile image updated successfully!",
        USER_NAME_ALREADY_MESSAGE:"User name is already exist!"
    },
    token: {
        REQUIRED_ERROR_MESSAGE: "A token is required for authentication",
        UNMATCH_ERROR_MESSAGE: "Token does not match",
        INVALID_ERROR_MESSAGE: "Invalid token",
        MISSING_ERROR_MESSAGE: "Access denied. Token is missing.",
        ROLE_NOT_ASSIGNED_ERROR_MESSAGE: "You have not role."
    },
}

module.exports = messages