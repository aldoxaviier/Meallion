const router = require("express").Router();
const { userController } = require("./controller");
const validation = require("../../middleware/validations");
const { registerSchema, loginSchema, otpSchema} = require("../../utils/validations");
const authorization = require("../../middleware/authorization");

router.post("/login", validation(loginSchema), userController.login);
router.post("/register", validation(registerSchema), userController.register);
router.post("/SendOTP", validation(otpSchema), userController.reqOTP);
router.post("/refresh", userController.refresh);
router.get("/logout",authorization, userController.logout);
module.exports = router;