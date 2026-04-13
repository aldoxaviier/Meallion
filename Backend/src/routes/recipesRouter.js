const router = require("express").Router();
const recipesController = require("../controller/recipesController");
const authorization = require("../middleware/authorization");
const multer = require("multer");
const path = require("path");
const storage = multer.memoryStorage({
    destination: "assets/recipe/",
    filename: (req,file,cb) => {
        cb(null,Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({storage});


router.get("/getAll", recipesController.getAllRecipes);
router.get("/getIngredients", recipesController.getIngredients);
router.get("/get10Recipes", recipesController.get10Recipes);
router.get("/getRecipesByNameCategory", recipesController.getRecipesByNameCategory);
router.get("/getRecipesByID", recipesController.getRecipeByID)
router.post("/addReview", authorization, recipesController.addReview)
router.get("/getReview", recipesController.getReview)
router.get("/getMealPlan", authorization, recipesController.getMealPlan)
router.get("/getLikesByUserId", authorization, recipesController.getLikesByUserId)
router.post("/addToMealPlan", authorization, recipesController.addToMealPlan)
router.delete("/removeLikes", authorization, recipesController.removeLikes)
router.delete("/deleteMealPlan", authorization, recipesController.deleteMealPlan)
router.post("/addRecipe", authorization, upload.single("image"), recipesController.addRecipe)
router.post("/addLikes", authorization, recipesController.addLikes)
router.post("/updateMealProgress", authorization, recipesController.updateMealProgress)
router.get("/search-ingredients", recipesController.searchIngredients)
router.get("/get-categories", recipesController.getCategories)
module.exports = router;
