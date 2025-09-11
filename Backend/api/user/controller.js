const userService = require("./service");
const ApiResponse = require("../../utils/apiResponse");
class userController {
    static async reqOTP(req, res) {
        try {
            const { email } = req.body;
            const result = await userService.reqOTP(email);
            res.json(ApiResponse.success("OTP sent successfully", { otp: result }, 200));
        } catch (err) {
            console.error(err.message);
            res.json(ApiResponse.error(err.message, 500));
        }
    }

    static async login(req, res) {
        res.json({message: "Login endpoint"});
    }

    static async register(req, res) {
        try {
            const { email, name, password, otp } = req.body;
            const result = await userService.register(email, name, password, otp);
            if (!result) {
                res.json(ApiResponse.error("OTP is not valid", 400));
            }else{
                res.json(ApiResponse.success("User registered successfully", { user: result }, 201));
            }
        } catch (err) {
            console.error(err.message)
            res.json(ApiResponse.error(err.message, 500));
        }
    }
}

module.exports = { userController };