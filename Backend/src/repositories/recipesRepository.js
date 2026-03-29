const Database = require("../config/db");

const getAll = async () => {
     const result = await Database.from("recipes").select("*");
     return result.data;
}

const addBookmark = async (userId, recipeId) => {
     const result = await Database.from("bookmarks").insert({ user_id: userId, recipe_id: recipeId, rating:1 });
     return result.data;
}

const getBookmarksByUserId = async (userId) => {
     const result = await Database.from("bookmarks").select("*").eq("user_id", userId);
     return result.data;
}

const getIngredients = async (query) => {
     const result = await Database.from("ingredients_mapping").select("*").ilike("simplified_name", `%${query}%`);
     console.log("Ingredients result:", result)
     return result.data;
}

const getRecipesByName = async (query, firstPage, nextPage) => {
     const { data, count } = await Database.from("recipes").select("*", { count: "exact" }).ilike("name", `%${query}%`).range(firstPage, nextPage);
     return {
     data: data,
     total: count
     };
}

const getRecipesByCategory = async (categories, firstPage, nextPage) => {
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

const getRecipesByNameCategory = async (query, categories, firstPage, nextPage) => {
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

const get10Recipes = async () => {
     const result = await Database.from("recipes").select("*").in("recipe_id", [3233, 1832, 4009, 3369, 3317, 3413, 809, 468, 547, 1415]);
     return result.data;
}

const getRecipeByID = async (id) => {
     const result = await Database.from("recipes").select("*").eq("recipe_id", id)
     return result.data
}

const addReview = async (userId, recipeId, name, selectedRating, review) => {
     const { error } = await Database.from("ratings").insert({ user_id: userId, recipe_id: recipeId, name: name, rating: selectedRating, review: review });
}

const getRatingTotal = async (recipeId) => {
     const ratingTotal = await Database.from("ratings").select("rating", { count: "exact" }).eq("recipe_id", recipeId)
     console.log(ratingTotal.data);
     return ratingTotal
}

const updateRating = async (recipeId, rating_score, rating_total) => {
     const { error } = await Database.from("recipes").update({ rating_score: rating_score, rating_total: rating_total }).eq("recipe_id", recipeId)
}

const getReview = async (recipeId, query) => {
     const result = await Database.from("ratings").select("*").eq("recipe_id", recipeId).ilike("name", `%${query}%`)
     return result.data
}

const getMealPlan = async (userId, date) => {
     const result = await Database.from("mealplan").select("id, recipe_id, meal_time, recipes(name, Calories, TotalTime, Images, FatContent, CarbohydrateContent, ProteinContent)").eq('user_id', userId).eq('date', date)
     return result.data
}

const getProgressMeal = async (userId, date) => {
     const result = await Database.from("user_health_tracker").select("id, progress_cal, progress_carb, progress_pro, progress_fat").eq('user_id', userId).eq('date', date)
     return result.data
}

const getLikesByUserId = async (userId, recipeId) => {
        let query = Database.from("likes").select("recipe_id, recipes(name, Images, Calories, TotalTime, FatContent, CarbohydrateContent, ProteinContent)").eq("user_id", userId);

        if (recipeId) {
            query = query.eq("recipe_id", recipeId);
        }
        const result = await query;
        return result.data;
    }

const addToMealPlan = async (userId, recipeId, mealType, date) => {
     const { error } = await Database.from("mealplan").insert({ user_id: userId, recipe_id: recipeId, meal_time: mealType, date: date })
     console.log(error);
}

const removeLikes = async (userId, recipeId) => {
     const { error } = await Database.from("likes").delete().eq("user_id", userId).eq("recipe_id", recipeId)
     console.log(error);
}

const deleteMealPlan = async (userId, mealId) => {
     const { error } = await Database.from("mealplan").delete().eq("user_id", userId).eq("id", mealId)
     console.log(error);
}

const addRecipe = async (data) => {
     const result = await Database.from("recipes").insert(
          {user_id: data.userId, height: data.height, 
          weight: data.weight, activity_level: data.activity_level, 
          goal_plan: data.goal_plan, allergies: data.dislikes, 
          diet_preferences: data.diet_preferences,birthdate: data.birthdate,
          gender: data.gender,health_condition: data.healthCondition,target_calories: data.target_calories, 
          target_carbs: data.target_carbs, target_proteins: data.target_proteins, 
          target_fats: data.target_fats, updated_at: data.updated_at});
     return result.data;
}

const addLikes = async (userId, recipeId) => {
     const result = await Database.from("likes").insert({ user_id: userId, recipe_id: recipeId })
     return result.data;
}
     

module.exports = {
     getAll,
     addBookmark,
     getBookmarksByUserId,
     getIngredients,
     getRecipesByNameCategory,
     get10Recipes,
     getRecipeByID,
     addReview,
     getRatingTotal,
     updateRating,
     getReview,
     getMealPlan,
     getProgressMeal,
     getLikesByUserId,
     addToMealPlan,
     removeLikes,
     deleteMealPlan,
     addRecipe,
     getRecipesByCategory,
     getRecipesByName,
     addLikes
};
