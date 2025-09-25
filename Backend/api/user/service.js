const randomstring = require("randomstring");
const mailer = require("../../utils/nodemailer");
const { redisClient } = require("../../utils/redis");
const userRepository = require("./repository");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../../utils/jwtGenerator");
const jwt = require("jsonwebtoken");
class userService {
    static async reqOTP(email,res) {
        const user = await userRepository.findEmailUnique(email);
        console.log("user:", user.data);
        if (user.data.length > 0) {
            throw new Error("Email already exists");
        }
        const otp = randomstring.generate({ length: 6, charset: "numeric" });
        redisClient.setEx("otptoken", 120, otp);
        await mailer.sendOTP(email, otp);
        return otp;
    }

    static async register(email, name, password, otp) {
        const storedOtp = await redisClient.get("otptoken");
        if (storedOtp !== otp) {
            return;
        }
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptpassword = await bcrypt.hash(password,salt);
        const result = await userRepository.createUser(email, name, bcryptpassword);
        const refreshToken = jwtGenerator.refreshToken(result.data[0].user_id);
        const accessToken = jwtGenerator.accessToken(result.data[0].user_id);
        await userRepository.updateRefreshToken(result.data[0].user_id, refreshToken);
        return { accessToken, refreshToken };
    }

    static async login(email, password) {
        const user = await userRepository.findUserByEmail(email);
        if(user.data.length === 0){
            throw new Error("Email or password is incorrect");
        }
        const validPassword = await bcrypt.compare(password, user.data[0].password);
        console.log(validPassword);
        console.log(password)
        if(!validPassword){
            throw new Error("Email or password is incorrect");
        }
        const refreshToken = jwtGenerator.refreshToken(user.data[0].user_id);
        const accessToken = jwtGenerator.accessToken(user.data[0].user_id);
        await userRepository.updateRefreshToken(user.data[0].user_id, refreshToken);
        return { accessToken, refreshToken};
    }

    static async refresh(refreshToken) {
        const isvalid = jwt.verify(refreshToken, process.env.RefreshSecret);
        const storedRefreshToken = await userRepository.findUserRefreshToken(refreshToken);
        if(storedRefreshToken.data.length === 0){
            throw new Error("Refresh token is revoked");
        }
        if(isvalid){
            const newAccessToken = jwtGenerator.accessToken(isvalid.user);
            return newAccessToken;
        }else{
            throw new Error("Token is not valid");
        }
    }
}

module.exports = userService;
