const Database = require("../config/db");

class recipesRepository {

   static async getAll() {
        const result = await Database.from("recipes").select("*");
        return result.data;
   }

   static async addBookmark(userId, recipeId) {
        const result = await Database.from("bookmarks").insert({ user_id: userId, recipe_id: recipeId, rating:1 });
        return result.data;
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

   static async getRecipesByName(query, firstPage, nextPage) {
        const { data, count } = await Database.from("recipes").select("*", { count: "exact" }).ilike("name", `%${query}%`).range(firstPage, nextPage);
        return {
          data: data,
          total: count
        };
   }

   static async getRecipesByCategory(categories, firstPage, nextPage) {
     let dbQuery = Database.from("recipes").select("*", { count: "exact" })
     categories.forEach(tags => {
          dbQuery = dbQuery.ilike("tags", `%${tags}%`)
     });

     const { data, count } = await dbQuery.range(firstPage, nextPage);
     return {
          data: data,
          total: count
     };
   }

   static async getRecipesByNameCategory(query, categories, firstPage, nextPage) {
     let dbQuery = Database.from("recipes").select("*", { count: "exact" })
     dbQuery = dbQuery.ilike("name", `%${query}%`)
     categories.forEach(tags => {
          dbQuery = dbQuery.ilike("tags", `%${tags}%`)
     });
     const { data, count } = await dbQuery.range(firstPage, nextPage);
     return {
          data: data,
          total: count
     };
   }

   static async get10Recipes() {
        const result = await Database.from("recipes").select("*").in("recipe_id", [3233, 1832, 4009, 3369, 3317, 3413, 809, 468, 547, 1415]);
        return result.data;
   }
}

module.exports = recipesRepository;
