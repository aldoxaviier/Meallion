const userService = require("../service/userService");
const ApiResponse = require("../utils/apiResponse");
const userRepository = require("../repositories/userRepository");
const profileRepository = require("../repositories/profileRepository");

const reqOTP = async (req, res) => {
    console.log("Requesting OTP");
    try {
        const { email } = req.body;
        const result = await userService.reqOTP(email);
        res.json(ApiResponse.success("OTP sent successfully", { otp: result }, 200));
    } catch (err) {
        console.error(err.message);
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}
const login = async (req, res) => {
    try {
        console.log("login backend");
        const { email, password } = req.body;
        const result = await userService.login(email, password);
        const profile = await profileRepository.getProfile(result.userId);
        const interactions = await profileRepository.getInteractions(result.userId);
        res.status(200).json(ApiResponse.success("User logged in successfully", { refreshToken: result.refreshToken, accessToken: result.accessToken, hasProfile: !!profile, hasInteractions: interactions.length > 0 }, 200));
    } catch (err) {
        console.error(err.message);
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}

const register = async (req, res) => {
    try {
        const { email, name, password, otp } = req.body;
        const result = await userService.register(email, name, password, otp);
        if (!result) {
            res.status(400).json(ApiResponse.error("OTP is not valid", 400));
        }else{
            res.status(201).json(ApiResponse.success("User registered successfully", { refreshToken: result.refreshToken, accessToken: result.accessToken }, 201));
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}

const refresh = async (req, res) => {
    try {
        const {refreshToken} = req.body;
        const result = await userService.refresh(refreshToken);
        res.status(200).json(ApiResponse.success("Access token generated successfully", { accessToken: result }, 200));
    } catch (err) {
        console.error(err.message)
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}

const logout = async (req, res) => {
    try {
        const userId = req.user;
        await userRepository.removeExpoToken(userId);
        await userRepository.deleteRefreshToken(userId);
        res.status(200).json(ApiResponse.success("User logged out successfully", {}, 200));
    } catch (err) {
        console.error(err.message)
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}

const getUserRelationship = async (req, res) => {
    try {
        const userId = req.user;
        const targetUserId = req.query.target_user_id;
        const relationship = await userRepository.getUserRelationship(userId, targetUserId);
        res.status(200).json(ApiResponse.success("User relationship retrieved successfully", relationship, 200));
    } catch (err) {
        console.error(err.message)
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}

const updateFollowStatus = async (req, res) => {
    try {
        const userId = req.user;
        const { target_user_id, follow } = req.body;
        await userService.updateFollowStatus(userId, target_user_id, follow);
        res.status(200).json(ApiResponse.success("Follow status updated successfully", {}, 200));
    } catch (err) {
        console.error(err.message)
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}

const updatePushToken = async (req, res) => {
    try {
        const userId = req.user;
        const { expo_push_token } = req.body; 

        await userRepository.updateExpoToken(userId, expo_push_token);

        res.status(200).json(ApiResponse.success("Push token updated successfully", {}, 200));
    } catch (err) {
        console.error(err.message);
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
};

const getNotifications = async (req, res) => {
    try {
        const userId = req.user;
        const notifications = await userRepository.getNotificationsByUserId(userId);
        res.status(200).json(ApiResponse.success("Notifications retrieved successfully", notifications, 200));
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}

const markNotificationRead = async (req, res) => {
    try {
        const notifId = req.body.id;
        await userRepository.markNotificationRead(notifId);
        res.status(200).json(ApiResponse.success("Notification marked as read", {}, 200));
    } catch (err) {
        console.error(err.message);
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}

const deleteNotifications = async (req, res) => {
    try {
        const NotifId = req.query.id;
        await userRepository.deleteNotifications(NotifId);
        res.status(200).json(ApiResponse.success("Notifications deleted successfully", {}, 200));
    } catch (err) {
        console.error(err.message);
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}

const otpForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await userService.reqOTPForgotPassword(email);
        res.status(200).json(ApiResponse.success("OTP sent successfully", result, 200));
    } catch (err) {
        console.error(err.message);
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}

const validateOtpForgotPassword = async (req, res) => {
    try {
        const {otp, email} = req.body;
        const result = await userService.validateOtpForgotPassword(email, otp);
        if (result) {
            res.status(200).json(ApiResponse.success("OTP is valid", {}, 200));
        } else {
            res.status(400).json(ApiResponse.error("OTP is not valid", 400));
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}

const forgotPassword = async (req, res) => {
    try {
        const {email, password} = req.body;
        const result = await userService.forgotPassword(email, password);
        res.status(200).json(ApiResponse.success("Password updated successfully", result, 200));
    } catch (err) {
        console.error(err.message);
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}

module.exports = { reqOTP, login, register, refresh, logout, getUserRelationship, updateFollowStatus, updatePushToken, getNotifications, markNotificationRead, deleteNotifications, otpForgotPassword, forgotPassword, validateOtpForgotPassword };
