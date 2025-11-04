const recipesRepository = require("../repositories/recipesRepository");
const ApiResponse = require("../utils/apiResponse");

class recipesController {
   static async getAllRecipes(req, res) {
       try {
           const recipes = await recipesRepository.getAll();
           res.json(ApiResponse.success("Recipes fetched successfully", { recipes }, 200));
       } catch (err) {
           console.error(err.message);
           res.status(500).json(ApiResponse.error("Internal Server Error", 500));
       }
   }

   static async addBookmark(req, res) {
       try {
           const { recipeId } = req.body;
           const userId = req.user;
           await recipesRepository.addBookmark(userId, recipeId);
           res.status(201).json(ApiResponse.success("Bookmark added successfully", null, 201));
       } catch (error) {
           console.error(error.message);
           res.status(500).json(ApiResponse.error("Internal Server Error", 500));
       }
   }

   static async getBookmarksByUserId(req, res) {
       try {
           const userId = req.user;
           const result = await recipesRepository.getBookmarksByUserId(userId);
           res.json(ApiResponse.success("Bookmarks fetched successfully", { result }, 200));
       } catch (error) {
           console.error(error.message);
           res.status(500).json(ApiResponse.error("Internal Server Error", 500));
       }
   }
   static async getIngredients(req, res) {
    try {
        const query = req.query.q;
        const result = await recipesRepository.getIngredients(query);
        res.json(ApiResponse.success("Ingredients fetched successfully", result , 200));
    } catch (err) {
        console.error(err.message);
        res.status(500).json(ApiResponse.error("Internal Server Error", 500));
    }
   }

}

module.exports = { recipesController };