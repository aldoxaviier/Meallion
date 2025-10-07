const userService = require("../service/userService");
const ApiResponse = require("../utils/apiResponse");
const userRepository = require("../repositories/userRepository");
class userController {
    static async reqOTP(req, res) {
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

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await userService.login(email, password);
            res.status(200).json(ApiResponse.success("User logged in successfully", { refreshToken: result.refreshToken, accessToken: result.accessToken }, 200));
        } catch (err) {
            console.error(err.message);
            res.status(500).json(ApiResponse.error(err.message, 500));
        }
    }

    static async register(req, res) {
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

    static async refresh(req, res) {
        try {
            const {refreshToken} = req.body;
            const result = await userService.refresh(refreshToken);
            res.status(200).json(ApiResponse.success("Access token generated successfully", { accessToken: result }, 200));
        } catch (err) {
            console.error(err.message)
            res.status(500).json(ApiResponse.error(err.message, 500));
        }
    }

    static async logout(req, res) {
        try {
            const userId = req.user;
            await userRepository.deleterefreshtoken(userId);
            res.status(200).json(ApiResponse.success("User logged out successfully", {}, 200));
        } catch (err) {
            console.error(err.message)
            res.status(500).json(ApiResponse.error(err.message, 500));
        }
    }
}

module.exports = { userController };