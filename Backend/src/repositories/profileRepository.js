const Database = require("../config/db");
const sql = require("../config/dbSql");

const addProfile = async (data) => {
    const result = await sql`
        INSERT INTO user_profiles (
            user_id, height, weight, activity_level, goal_plan,
            allergies, diet_preferences, birthdate, gender,
            health_condition, target_calories, target_carbs,
            target_proteins, target_fats, updated_at
        )
        VALUES (
            ${data.userId}, ${data.height}, ${data.weight}, ${data.activity_level}, ${data.goal_plan},
            ${data.dislikes}, ${data.diet_preferences}, ${data.birthdate}, ${data.gender},
            ${data.healthCondition}, ${data.target_calories}, ${data.target_carbs},
            ${data.target_proteins}, ${data.target_fats}, ${data.updated_at}
        )
        RETURNING *
    `;
    return result;
}
const getInteractionByUserAndRecipe = async ({ userId, recipeId }) => {
    const result = await sql`
        SELECT * FROM user_recipe_interactions
        WHERE user_id = ${userId}
        AND recipe_id = ${recipeId}
    `;

    return result[0];
}

const addInteraction = async ({ userId, recipeId, score }) => {
    const result = await sql`
        INSERT INTO user_recipe_interactions (user_id, recipe_id, score)
        VALUES (${userId}, ${recipeId}, ${score})
        RETURNING *
    `;

    return result[0];
}

const updateInteraction = async ({ userId, recipeId, score }) => {
    const result = await sql`
        UPDATE user_recipe_interactions
        SET score = ${score}
        WHERE user_id = ${userId}
        AND recipe_id = ${recipeId}
        RETURNING *
    `;

    return result[0];
}

const getProfile = async (userId) => {
    const result = await sql`
        SELECT 
            up.*,
            json_build_object(
                'name', u.name,
                'email', u.email
            ) as users
        FROM user_profiles up
        JOIN users u ON up.user_id = u.user_id
        WHERE up.user_id = ${userId}
    `;

    return result[0] || null;
}

const updateProfile = async (userId, updateData) => {
    const keys = Object.keys(updateData);

    if (keys.length === 0) return null;

    const result = await sql`
        UPDATE user_profiles
        SET ${sql(updateData, keys)}
        WHERE user_id = ${userId}
        RETURNING *
    `;

    return result[0];
}
const updateDietPreferences = async (userId, diet_preferences) => {
    const result = await sql`
        UPDATE user_profiles
        SET diet_preferences = ${diet_preferences}
        WHERE user_id = ${userId}
        RETURNING *
    `;

    console.log("updateDietPreferences result:", result);

    return result[0] || null;
}

module.exports =  { addProfile, getInteractionByUserAndRecipe, addInteraction, updateInteraction, getProfile, updateProfile, updateDietPreferences };