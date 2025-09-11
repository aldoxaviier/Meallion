const router = require("express").Router();
const { userController } = require("./controller");
const validation = require("../../middleware/validations");
const { registerSchema, loginSchema, otpSchema} = require("../../utils/validations");

router.post("/login", validation(loginSchema), userController.login);
router.post("/register", validation(registerSchema), userController.register);
router.post("/SendOTP", validation(otpSchema), userController.reqOTP);
module.exports = router;