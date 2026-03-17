const recipesRepository = require("../repositories/recipesRepository")
const recipesService = require("../service/recipesService")
const ApiResponse = require("../utils/apiResponse")

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
            const query = req.query.query;
            const result = await recipesRepository.getIngredients(query);
            res.json(ApiResponse.success("Ingredients fetched successfully", result , 200));
        } catch (err) {
            console.error(err.message);
            res.status(500).json(ApiResponse.error("Internal Server Error", 500));
        }
   }

   static async getRecipesByName(req, res) {
        try {
            const query = req.query.query;
            const category = req.query.category;
            const page = parseInt(req.query.page);
            const limit = parseInt(req.query.limit);
            const result = await recipesService.getRecipesByNameCategory(query, category, page, limit)
            const totalPage = Math.ceil(result.total/limit);
            res.json(ApiResponse.success("Recipe fetched successfully", {
                data: result.data,
                info: {
                    page: page,
                    limit: limit,
                    totalData: result.total,
                    totalPage: totalPage
                }
            }, 200));
        } catch (err) {
            console.error("Error in contoler getRecipesByName:", err.message);
            res.status(500).json(ApiResponse.error("Internal Server Error", 500));
        }
   }

   static async get10Recipes(req, res) {
        try {
            const allRecipes = await recipesRepository.get10Recipes();
            res.json(ApiResponse.success("10 Recipes fetched successfully", { recipes: allRecipes }, 200));
        } catch (err) {
            console.error(err.message);
            res.status(500).json(ApiResponse.error("Internal Server Error", 500));
        }
    }

    static async getRecipeByID(req, res) {
        try {
            const id = parseInt(req.query.id)
            const recipeData = await recipesRepository.getRecipeByID(id)
            res.json(ApiResponse.success("Ingredients fetched successfully", recipeData , 200));
        } catch (err) {
            console.error(err.message)
            res.status(500).json(ApiResponse.error("Internal Server Error", 500));
        }
    }

    static async addReview(req, res) {
        try {
            const { review, selectedRating, recipeId, name } = req.body
            const userId = req.user
            await recipesService.addReview(userId, recipeId, name, selectedRating, review)
            res.status(201).json(ApiResponse.success("Review Added Succesfully", null, 201));
        } catch (err) {
            console.error(err.message)
            res.status(500).json(ApiResponse.error("Internal Server Error", 500));
        }
    }

    static async getReview(req, res) {
        try {
            const recipeID = parseInt(req.query.id)
            const query = req.query.query
            const reviewData = await recipesRepository.getReview(recipeID, query)
            res.json(ApiResponse.success("Get Review successfully", reviewData , 200));
        } catch (err) {
            console.error(err.message)
            res.status(500).json(ApiResponse.error("Internal Server Error", 500));
        }
    }

    static async getMealPlan(req, res) {
        try {
            const userId = req.user
            const date = req.query.date
            const MealData = await recipesService.getMealPlan(userId, date)
            res.json(ApiResponse.success("Get Meal Plan Successfull", MealData, 200))
        } catch (err) {
            console.error(err.message)
            res.status(500).json(ApiResponse.error("Internal Server Error", 500));
        }
    }

    static async getLikesByUserId(req, res) {
        try {
            const userId = req.user
            const likedRecipes = await recipesRepository.getLikesByUserId(userId)
            res.json(ApiResponse.success("Get Liked Recipes Successfull", likedRecipes, 200))
        } catch (err) {
            console.error(err.message)
            res.status(500).json(ApiResponse.error("Internal Server Error", 500));
        }
    }

}

module.exports = { recipesController };