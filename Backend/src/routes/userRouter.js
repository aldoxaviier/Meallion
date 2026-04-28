const router = require("express").Router();
const userController = require("../controller/userController");
const userService = require("../service/userService");
const validation = require("../middleware/validations");
const { registerSchema, loginSchema, otpSchema} = require("../utils/validations");
const authorization = require("../middleware/authorization");

const cron = require("node-cron");

cron.schedule('* * * * *', () => {
  userService.pushNotifications();
});

router.post("/login", validation(loginSchema), userController.login);
router.post("/register", validation(registerSchema), userController.register);
router.post("/sendOTP", validation(otpSchema), userController.reqOTP);
router.post("/refresh", userController.refresh);
router.get("/logout", authorization, userController.logout);
router.post("/sendOTPforgot", validation(otpSchema), userController.otpForgotPassword);
router.post("/validate-otp-forgot", userController.validateOtpForgotPassword);
router.post("/forgot-password", userController.forgotPassword);


router.put("/updatePushToken", authorization, userController.updatePushToken);
router.get("/getNotifications", authorization, userController.getNotifications);
router.put("/markNotificationRead", userController.markNotificationRead);
router.delete("/deleteNotifications", userController.deleteNotifications);

router.get("/user-relationship", authorization, userController.getUserRelationship);
router.post("/update-follow", authorization, userController.updateFollowStatus);
module.exports = router;