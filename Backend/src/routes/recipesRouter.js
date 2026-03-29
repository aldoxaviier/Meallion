const router = require("express").Router();
const recipesController = require("../controller/recipesController");
const authorization = require("../middleware/authorization");

router.get("/getAll", recipesController.getAllRecipes);
router.get("/getIngredients", recipesController.getIngredients);
router.get("/get10Recipes", recipesController.get10Recipes);
router.get("/getRecipesByName", recipesController.getRecipesByName);
router.get("/getRecipesByID", recipesController.getRecipeByID)
router.post("/addReview", authorization, recipesController.addReview)
router.get("/getReview", recipesController.getReview)
router.get("/getMealPlan", authorization, recipesController.getMealPlan)
router.get("/getLikesByUserId", authorization, recipesController.getLikesByUserId)
router.post("/addToMealPlan", authorization, recipesController.addToMealPlan)
router.delete("/removeLikes", authorization, recipesController.removeLikes)
router.delete("/deleteMealPlan", authorization, recipesController.deleteMealPlan)
router.post("/addRecipe", authorization, recipesController.addRecipe)
router.get("/search-ingredients", recipesController.searchIngredients)
router.post("/addLikes", authorization, recipesController.addLikes)

module.exports = router;
