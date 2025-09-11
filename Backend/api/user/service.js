const randomstring = require("randomstring");
const mailer = require("../../utils/nodemailer");
const { redisClient } = require("../../utils/redis");
const userRepository = require("./respository");
const bcrypt = require("bcrypt");
class userService {
    static async reqOTP(email,res) {
        const user = await userRepository.findEmailUnique(email);
        if (user) {
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
        return result;
    }
}

module.exports = userService;
