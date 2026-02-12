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

   static async getRecipesByName(query, page = 1, limit = 10) {
     try {
          const firstPage = (page - 1) * limit;
          const nextPage = firstPage + limit - 1; 
          const { data, count} = await Database.from("recipes").select("*", { count: "exact" }).ilike("name", `%${query}%`).range(firstPage, nextPage);
          return {
               data: data,
               total: count
          };
     } catch (error) {
          console.error(error)
     }
   }

   static async get10Recipes() {
        const result = await Database.from("recipes").select("*").in("recipe_id", [3233, 1832, 4009, 3369, 3317, 3413, 809, 468, 547, 1415]);
        console.log("10 Recipes result:", result)
        return result.data;
   }
}

module.exports = recipesRepository;
