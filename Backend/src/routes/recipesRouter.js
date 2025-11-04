const router = require("express").Router();
const { recipesController } = require("../controller/recipesController");
const authorization = require("../middleware/authorization");

router.get("/getAll", recipesController.getAllRecipes);
router.post("/addBookmark", authorization, recipesController.addBookmark);
router.get("/getBookmarksByUserId", authorization,recipesController.getBookmarksByUserId);
router.get("/getIngredients", recipesController.getIngredients);
module.exports = router;
