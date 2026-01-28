const router = require("express").Router();
const { profileController } = require("../controller/profileController");
const validation = require("../middleware/validations");
const authorization = require("../middleware/authorization");

router.post("/addProfile", authorization, profileController.addProfile);
router.post("/addInteraction", authorization, profileController.addInteraction);
router.get("/test", authorization, (req, res) => {
    res.json({ message: "Profile route is working!" });
});

module.exports = router;