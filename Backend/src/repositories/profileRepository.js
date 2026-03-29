const Database = require("../config/db");

const addProfile = async (data) => {
    const result = await Database.from("user_profiles").insert(
        {user_id: data.userId, height: data.height, 
        weight: data.weight, activity_level: data.activity_level, 
        goal_plan: data.goal_plan, allergies: data.dislikes, 
        diet_preferences: data.diet_preferences,birthdate: data.birthdate,
        gender: data.gender,health_condition: data.healthCondition,target_calories: data.target_calories, 
        target_carbs: data.target_carbs, target_proteins: data.target_proteins, 
        target_fats: data.target_fats, updated_at: data.updated_at});
    console.log("addProfile result:", result);
    return result.data;
}
const getInteractionByUserAndRecipe = async ({ userId, recipeId}) => {
    const result = await Database.from("user_recipe_interactions")
        .select("*")
        .eq("user_id", userId)
        .eq("recipe_id", recipeId)
    return result.data;
}
const addInteraction = async ({ userId, recipeId, score }) => {
    const result = await Database.from("user_recipe_interactions")
        .insert({ user_id: userId, recipe_id: recipeId, score: score });
    return result.data;
}
const updateInteraction = async ({ userId, recipeId, score }) => {
    const result = await Database.from("user_recipe_interactions")
        .update({ score: score })
        .eq("user_id", userId)
        .eq("recipe_id", recipeId);
    return result.data;
}
const getProfile = async (userId) => {
    const result = await Database
        .from('user_profiles')
        .select(`*,
            users(
                name,
                email
            )`).eq("user_id", userId)
    return result.data
}
const updateProfile = async (userId, updateData) => {
    console.log("masuk", updateData);
    const result = await Database
        .from('user_profiles')
        .update(updateData)
        .eq("user_id", userId)
        .select();
    console.log("updateProfile result:", result);
    return result.data;
}
const updateDietPreferences = async (userId, diet_preferences) => {
    const result = await Database
        .from('user_profiles')
        .update({ diet_preferences: diet_preferences })
        .eq("user_id", userId)
        .select();
    console.log("updateDietPreferences result:", result);
    return result.data;
}

module.exports =  { addProfile, getInteractionByUserAndRecipe, addInteraction, updateInteraction, getProfile, updateProfile, updateDietPreferences };