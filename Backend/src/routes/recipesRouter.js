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
router.get("/getReview", recipesController.getReview)
router.get("/getMealPlan", authorization, recipesController.getMealPlan)
router.get("/getLikesByUserId", authorization, recipesController.getLikesByUserId)
router.get("/search-ingredients", recipesController.searchIngredients)
router.get("/get-categories", recipesController.getCategories)
router.get("/getRecIngByRecipeId", recipesController.getRecIngByRecipeId)
router.get("/get-recipes-by-user", authorization, recipesController.getRecipesByUser)
router.get("/recipes-by-following", authorization, recipesController.getRecipesByFollowing)


router.post("/addToMealPlan", authorization, recipesController.addToMealPlan)
router.post("/addRecipe", authorization, upload.single("image"), recipesController.addRecipe)
router.post("/addLikes", authorization, recipesController.addLikes)
router.post("/updateMealProgress", authorization, recipesController.updateMealProgress)
router.post("/mealplan-generate", authorization, recipesController.generateMealPlan)
router.post("/addReview", authorization, recipesController.addReview)

router.delete("/removeLikes", authorization, recipesController.removeLikes)
router.delete("/deleteMealPlan", authorization, recipesController.deleteMealPlan)
router.delete("/deleteRecipe", authorization, recipesController.deleteRecipe)



module.exports = router;
