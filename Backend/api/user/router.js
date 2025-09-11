const router = require("express").Router();
const { userController } = require("./controller");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/SendOTP", userController.reqOTP);
module.exports = router;