const Database = require("../config/db");

class profileRepository {
    static async addProfile(data) {
        const result = await Database.from("user_profiles").insert(
            {user_id: data.userId, height: data.height, 
            weight: data.weight, activity_level: data.activity_level, 
            goal_plan: data.goal_plan, allergies: data.dislikes, 
            diet_preferences: data.diet_preferences, updated_at: data.updated_at});
        console.log(data);
        return result.data;
    }
    static async getInteractionByUserAndRecipe({ userId, recipeId}) {
        const result = await Database.from("user_interactions")
            .select("*")
            .eq("user_id", userId)
            .eq("recipe_id", recipeId)
        return result.data;
    }
    static async addInteraction({ userId, recipeId, score }) {
        const result = await Database.from("user_interactions")
            .insert({ user_id: userId, recipe_id: recipeId, score: score });
        return result.data;
    }
    static async updateInteraction({ userId, recipeId, score }) {
        const result = await Database.from("user_interactions")
            .update({ score: score })
            .eq("user_id", userId)
            .eq("recipe_id", recipeId);
        return result.data;
    }
    static async getProfile(userId) {
        const result = await Database
            .from('user_profiles')
            .select(`*,
                users(
                    name,
                    email
                )`).eq("user_id", userId)
        return result
    }
}

module.exports = { profileRepository };