const userService = require("../service/userService");
const ApiResponse = require("../utils/apiResponse");
const userRepository = require("../repositories/userRepository");

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
        res.status(200).json(ApiResponse.success("User logged in successfully", { refreshToken: result.refreshToken, accessToken: result.accessToken }, 200));
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
        await userRepository.updateFollowStatus(userId, target_user_id, follow);
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

module.exports = { reqOTP, login, register, refresh, logout, getUserRelationship, updateFollowStatus, updatePushToken };
