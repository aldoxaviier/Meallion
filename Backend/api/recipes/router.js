const router = require("express").Router();
const { recipesController } = require("./controller");
const authorization = require("../../middleware/authorization");

router.get("/getAll", recipesController.getAllRecipes);
router.post("/addBookmark", authorization, recipesController.addBookmark);
router.get("/getBookmarksByUserId", authorization,recipesController.getBookmarksByUserId);

module.exports = router;
