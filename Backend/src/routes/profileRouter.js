const router = require("express").Router();
const { profileController } = require("../controller/profileController");
const validation = require("../middleware/validations");
const authorization = require("../middleware/authorization");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: "assets/avatar/",
    filename: (req,file,cb) => {
        cb(null,Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage});


router.post("/addProfile", authorization, profileController.addProfile);
router.post("/addInteraction", authorization, profileController.addInteraction);
router.get("/getProfile", authorization, profileController.getProfile);
router.get("/test", authorization, (req, res) => {
    res.status(200).json({message: "Profile route working"});
});
router.put("/editProfile", authorization,upload.single("image"), profileController.editProfile);
module.exports = router;