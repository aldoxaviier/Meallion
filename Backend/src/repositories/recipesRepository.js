const Database = require("../config/db");
const sql = require("../config/dbSql");

const getAll = async () => {
    const result = await sql`
        SELECT * FROM recipes
    `;
    return result;
}

const getIngredients = async (query) => {
    const result = await sql`
        SELECT * FROM ingredients_mapping
        WHERE simplified_name ILIKE ${'%' + query + '%'}
    `;
    return result;
}

const getRecipesByNameCategory = async (query, categories, firstPage, nextPage) => {
    const conditions = [];

    if (query && query.trim() !== "") {
        conditions.push(sql`name ILIKE ${'%' + query + '%'}`);
    }

    if (Array.isArray(categories) && categories.length > 0) {
        categories.forEach(tag => {
            conditions.push(sql`tags ILIKE ${'%' + tag + '%'}`);
        });
    }

    let whereClause = sql``;
    if (conditions.length > 0) {
        whereClause = sql`WHERE ${conditions.reduce((prev, curr) => sql`${prev} AND ${curr}`)}`;
    }

    const result = await sql`
        SELECT *, COUNT(*) OVER() AS total_count
        FROM recipes
        ${whereClause}
        ORDER BY "DatePublished" DESC
        LIMIT ${nextPage - firstPage + 1}
        OFFSET ${firstPage}
    `;

    return {
        data: result,
        total: result.length > 0 ? Number(result[0].total_count) : 0
    };
};

const get10Recipes = async () => {
    const ids = [3233, 1832, 4009, 3369, 3317, 3413, 809, 468, 547, 1415];
    const result = await sql`
        SELECT * FROM recipes
        WHERE recipe_id = ANY(${ids})
    `;
    return result;
}

const getRecipeByID = async (id) => {
    const result = await sql`
        SELECT r.*, up.profile_image 
        FROM recipes r
        LEFT JOIN user_profiles up ON r.user_id = up.user_id
        WHERE r.recipe_id = ${id}
    `;
    return result[0];
}

const addReview = async (userId, recipeId, name, selectedRating, review) => {
    const result = await sql`
        INSERT INTO ratings (user_id, recipe_id, name, rating, review)
        VALUES (${userId}, ${recipeId}, ${name}, ${selectedRating}, ${review})
        RETURNING *
    `;
    return result[0] || null;
}

const getRatingTotal = async (recipeId) => {
    const result = await sql`
        SELECT rating, COUNT(*) OVER() AS total_count
        FROM ratings
        WHERE recipe_id = ${recipeId}
    `;
    return result;
};

const updateRating = async (recipeId, rating_score, rating_total) => {
    const result = await sql`
        UPDATE recipes
        SET rating_score = ${rating_score},
            rating_total = ${rating_total}
        WHERE recipe_id = ${recipeId}
        RETURNING *;
    `;
    return result;
};

const getReview = async (recipeId, query) => {
    const result = await sql`
        SELECT *
        FROM ratings
        WHERE recipe_id = ${recipeId}
        AND name ILIKE ${'%' + query + '%'}
    `;
    return result;
};

const getMealPlan = async (userId, date) => {
    const result = await sql`
        SELECT 
            m.id,
            m.recipe_id,
            m.meal_time,
            m.is_eaten,
            r.name,
            r."Calories",
            r."TotalTime",
            r."Images",
            r."FatContent",
            r."CarbohydrateContent",
            r."ProteinContent"
        FROM mealplan m
        JOIN recipes r ON m.recipe_id = r.recipe_id
        WHERE m.user_id = ${userId}
        AND m.date = ${date}
    `;

    return result;
};

const getMealPlanById = async (userId, mealId) => {
    const result = await sql`
        SELECT 
            id, 
            is_eaten 
        FROM mealplan 
        WHERE user_id = ${userId} 
        AND id = ${mealId}
        LIMIT 1
    `;
    
    return result[0] || null;
};

const getProgressMeal = async (userId, date) => {
    const result = await sql`
        SELECT 
            id,
            progress_cal,
            progress_carbs,
            progress_pro,
            progress_fat
        FROM user_health_tracker
        WHERE user_id = ${userId}
        AND date = ${date}
        LIMIT 1
    `;
    return result[0] || null;
};

const getLikesByUserId = async (userId, recipeId) => {
    const result = recipeId
        ? await sql`
            SELECT 
                l.recipe_id,
                r.name,
                r."Images",
                r."Calories",
                r."TotalTime",
                r."FatContent",
                r."CarbohydrateContent",
                r."ProteinContent"
            FROM likes l
            JOIN recipes r ON l.recipe_id = r.recipe_id
            WHERE l.user_id = ${userId}
            AND l.recipe_id = ${recipeId}
        `
        : await sql`
            SELECT 
                l.recipe_id,
                r.name,
                r."Images",
                r."Calories",
                r."TotalTime",
                r."FatContent",
                r."CarbohydrateContent",
                r."ProteinContent"
            FROM likes l
            JOIN recipes r ON l.recipe_id = r.recipe_id
            WHERE l.user_id = ${userId}
        `;
    return result;
};

const addToMealPlan = async (userId, recipeId, mealType, date) => {
     const result = await sql`
          INSERT INTO mealplan (user_id, recipe_id, meal_time, date)
          VALUES (${userId}, ${recipeId}, ${mealType}, ${date})
          RETURNING *;
     `;
     return result;
};

const removeLikes = async (userId, recipeId) => {
     const result = await sql`
          DELETE FROM likes
          WHERE user_id = ${userId}
          AND recipe_id = ${recipeId}
          RETURNING *;
     `;
     return result;
};

const deleteMealPlan = async (userId, mealId) => {
     const result = await sql`
          DELETE FROM mealplan
          WHERE user_id = ${userId}
          AND id = ${mealId}
          RETURNING *;
     `;
     return result;
};

const addRecipe = async (data) => {
     const result = await sql`
          INSERT INTO recipes (
               user_id,
               height,
               weight,
               activity_level,
               goal_plan,
               allergies,
               diet_preferences,
               birthdate,
               gender,
               health_condition,
               target_calories,
               target_carbs,
               target_proteins,
               target_fats,
               updated_at
          )
          VALUES (
               ${data.userId},
               ${data.height},
               ${data.weight},
               ${data.activity_level},
               ${data.goal_plan},
               ${data.dislikes},
               ${data.diet_preferences},
               ${data.birthdate},
               ${data.gender},
               ${data.healthCondition},
               ${data.target_calories},
               ${data.target_carbs},
               ${data.target_proteins},
               ${data.target_fats},
               ${data.updated_at}
          )
          RETURNING *;
     `;
     return result;
};

const addLikes = async (userId, recipeId) => {
    try {
        const result = await sql`
            INSERT INTO likes (user_id, recipe_id)
            VALUES (${userId}, ${recipeId})
            RETURNING *;
        `;
        return result;
    } catch (error) {
        console.log(error);
    }
};
     
const updateMealPlan = async (userId, mealIDs) => {
    const result = await sql`
        UPDATE mealplan 
        SET is_eaten = true 
        WHERE user_id = ${userId} 
        AND id IN ${sql(mealIDs)};
    `;
    return result;
};

const addMealProgress = async (userId, date, progress_cal, progress_pro, progress_fat, progress_carbs) => {
    const result = await sql`
        INSERT INTO user_health_tracker 
            (user_id, date, progress_cal, progress_pro, progress_fat, progress_carbs)
        VALUES 
            (${userId}, ${date}, ${progress_cal}, ${progress_pro}, ${progress_fat}, ${progress_carbs})
        RETURNING *;
    `;
    return result;
};

const updateMealProgress = async (userId, date, progress_cal, progress_pro, progress_fat, progress_carbs) => {
    const result = await sql`
        UPDATE user_health_tracker 
        SET 
            progress_cal = ${progress_cal}, 
            progress_pro = ${progress_pro}, 
            progress_fat = ${progress_fat}, 
            progress_carbs = ${progress_carbs}
        WHERE user_id = ${userId} 
        AND date = ${date}
        RETURNING *;
    `;
    return result;
};

module.exports = {
     getAll,
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
     addLikes,
     updateMealPlan,
     addMealProgress,
     updateMealProgress,
     getMealPlanById,
};
