const randomstring = require("randomstring");
const mailer = require("../utils/nodemailer");
const { redisClient } = require("../utils/redis");
const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const jwt = require("jsonwebtoken");

const reqOTP = async (email, res) => {
    const user = await userRepository.findEmailUnique(email);
    if (user) {
        throw new Error("Email already exists");
    }
    const otp = randomstring.generate({ length: 6, charset: "numeric" });
    redisClient.setEx("otptoken", 130, otp);
    await mailer.sendOTP(email, otp);
    return otp;
}

const register = async (email, name, password, otp) => {
    const storedOtp = await redisClient.get("otptoken");
    console.log("Stored OTP:", storedOtp, "Provided OTP:", otp);
    if (storedOtp !== otp) {
        return;
    }
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptpassword = await bcrypt.hash(password,salt);
    const result = await userRepository.createUser(email, name, bcryptpassword);
    console.log("User created:", result);
    const refreshToken = jwtGenerator.refreshToken(result.user_id);
    const accessToken = jwtGenerator.accessToken(result.user_id);
    await userRepository.updateRefreshToken(result.user_id, refreshToken);
    console.log(accessToken, refreshToken);
    return { accessToken, refreshToken };
}

const login = async (email, password) => {
    const user = await userRepository.findUserByEmail(email);
    if(!user){
        throw new Error("Email or password is incorrect");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword);
    console.log(password)
    if(!validPassword){
        throw new Error("Email or password is incorrect");
    }
    const refreshToken = jwtGenerator.refreshToken(user.user_id);
    const accessToken = jwtGenerator.accessToken(user.user_id);
    await userRepository.updateRefreshToken(user.user_id, refreshToken);
    return { accessToken, refreshToken};
}

const refresh = async (refreshToken) => {
    const isvalid = jwt.verify(refreshToken, process.env.RefreshSecret);
    const storedRefreshToken = await userRepository.findUserRefreshToken(refreshToken);
    if(!storedRefreshToken){
        throw new Error("Refresh token is revoked");
    }
    if(isvalid){
        const newAccessToken = jwtGenerator.accessToken(isvalid.user);
        return newAccessToken;
    }else{
        throw new Error("Token is not valid");
    }
}

module.exports = {
    reqOTP,
    register,
    login,
    refresh
};
