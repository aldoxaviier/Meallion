const randomstring = require("randomstring");
const mailer = require("../utils/nodemailer");
const { redisClient } = require("../utils/redis");
const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const jwt = require("jsonwebtoken");
const { Expo } = require('expo-server-sdk');

const expo = new Expo();

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

const pushNotifications = async () => {
    try {
        const currentDate = new Date();
        const formattedTime = currentDate.toLocaleString('en-GB', { 
            timeZone: 'Asia/Jakarta', 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        });
        
        const notifications = await userRepository.getNotifications(formattedTime);
        console.log(`[${formattedTime}] Finding notifications:`, notifications);
        
        for (const notification of notifications) {
            if (notification.expo_push_token) {
                
                const title = `Time for ${notification.meal_type}!`; 
                const content = `Dont forget to have your ${notification.meal_type}!`;
                const notifType = 'meal_reminder';

                await sendPushNotification(notification.expo_push_token, title, content);

                await userRepository.saveNotificationHistory(notification.user_id, notifType, title, content);
                
                console.log(`Notif ${notification.meal_type}: ${notification.user_id}`);
            }
        }
    } catch (err) {
        console.error("Error in pushNotifications service:", err.message);
    }
}

const sendPushNotification = async (expoPushToken, title, messageBody) => {
    try {
        // Token Validation
        if (!Expo.isExpoPushToken(expoPushToken)) {
            console.error(`Token invalid: ${expoPushToken}`);
            return;
        }

        // messages
        const messages = [{ 
            to: expoPushToken, 
            sound: 'default', 
            title: title, 
            body: messageBody,
            data: { route: '/(tabs)/home' },
        }];
        const chunks = expo.chunkPushNotifications(messages);
        
        // Send the chunks to the Expo push notification service
        for (const chunk of chunks) {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        }

    } catch (error) {
        console.error("Failed to send push notification:", error);
    }
};


module.exports = {
    reqOTP,
    register,
    login,
    refresh,
    pushNotifications
};
