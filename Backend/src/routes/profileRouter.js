const router = require("express").Router();
const profileController = require("../controller/profileController");
const validation = require("../middleware/validations");
const authorization = require("../middleware/authorization");
const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage({
    destination: "assets/avatar/",
    filename: (req,file,cb) => {
        cb(null,Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage});


router.get("/getProfileFromID", profileController.getProfileFromID);
router.get("/getProfile", authorization, profileController.getProfile);

router.post("/addProfile", authorization, profileController.addProfile);
router.post("/addInteraction", authorization, profileController.addInteraction);

router.put("/updateProfile", authorization,upload.single("image"), profileController.updateProfile);
router.put("/updateDietPreferences", authorization, profileController.updateDietPreferences);

module.exports = router;