const Database = require("../config/db");

class recipesRepository {

   static async getAll() {
        const result = await Database.from("recipes").select("*");
        return result.data;
   }

   static async addBookmark(userId, recipeId) {
        const result = await Database.from("bookmarks").insert({ user_id: userId, recipe_id: recipeId, rating:1 });
        return result;
   }

   static async getBookmarksByUserId(userId) {
        const result = await Database.from("bookmarks").select("*").eq("user_id", userId);
        return result.data;
   }

   static async getIngredients(query) {
        const result = await Database.from("ingredients_mapping").select("*").ilike("simplified_name", `%${query}%`);
        console.log("Ingredients result:", result)
        return result.data;
   }
}

module.exports = recipesRepository;
