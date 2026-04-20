const router = require("express").Router();
const userController = require("../controller/userController");
const validation = require("../middleware/validations");
const { registerSchema, loginSchema, otpSchema} = require("../utils/validations");
const authorization = require("../middleware/authorization");

router.post("/login", validation(loginSchema), userController.login);
router.post("/register", validation(registerSchema), userController.register);
router.post("/sendOTP", validation(otpSchema), userController.reqOTP);
router.post("/refresh", userController.refresh);
router.get("/logout", authorization, userController.logout);

router.get("/user-relationship", authorization, userController.getUserRelationship);
router.post("/update-follow", authorization, userController.updateFollowStatus);
module.exports = router;