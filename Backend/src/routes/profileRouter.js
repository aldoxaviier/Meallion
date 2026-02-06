const router = require("express").Router();
const { profileController } = require("../controller/profileController");
const validation = require("../middleware/validations");
const authorization = require("../middleware/authorization");

router.post("/addProfile", authorization, profileController.addProfile);
router.post("/addInteraction", authorization, profileController.addInteraction);
router.get("/getProfile", authorization, profileController.getProfile);
router.get("/test", authorization, (req, res) => {
    res.status(200).json({message: "Profile route working"});
});
module.exports = router;