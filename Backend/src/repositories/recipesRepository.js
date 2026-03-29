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

const getRecipesByName = async (query, firstPage, nextPage) => {
    const data = await sql`
        SELECT * FROM recipes
        WHERE name ILIKE ${'%' + query + '%'}
        LIMIT ${nextPage - firstPage + 1}
        OFFSET ${firstPage}
    `;
    const countResult = await sql`
        SELECT COUNT(*) FROM recipes
        WHERE name ILIKE ${'%' + query + '%'}
    `;
    const total = Number(countResult[0].count);

    return {
        data,
        total
    };
}

const getRecipesByCategory = async (categories, firstPage, nextPage) => {
    const conditions = categories.map(tag => 
        sql`tags ILIKE ${'%' + tag + '%'}`
    );
    let whereClause = sql``;
    if (conditions.length > 0) {
        let combined = conditions[0];
        for (let i = 1; i < conditions.length; i++) {
            combined = sql`${combined} AND ${conditions[i]}`;
        }

        whereClause = sql`WHERE ${combined}`;
    }
    const result = await sql`
        SELECT *, COUNT(*) OVER() AS total_count
        FROM recipes
        ${whereClause}
        LIMIT ${nextPage - firstPage + 1}
        OFFSET ${firstPage}
    `;

    return {
        data: result,
        total: result.length > 0 ? Number(result[0].total_count) : 0
    };
}

const getRecipesByNameCategory = async (query, categories, firstPage, nextPage) => {
    const conditions = [
        sql`name ILIKE ${'%' + query + '%'}`
    ];

    for (const tag of categories) {
        conditions.push(sql`tags ILIKE ${'%' + tag + '%'}`
        );
    }

    let whereClause = sql``;

    if (conditions.length > 0) {
        whereClause = sql`
            WHERE ${conditions.reduce((prev, curr) => sql`${prev} AND ${curr}`)}
        `;
    }

    const result = await sql`
        SELECT *, COUNT(*) OVER() AS total_count
        FROM recipes
        ${whereClause}
        LIMIT ${nextPage - firstPage + 1}
        OFFSET ${firstPage}
    `;

    return {
        data: result,
        total: result.length > 0 ? Number(result[0].total_count) : 0
    };
}

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
        SELECT * FROM recipes
        WHERE recipe_id = ${id}
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

const getProgressMeal = async (userId, date) => {
    const result = await sql`
        SELECT 
            id,
            progress_cal,
            progress_carb,
            progress_pro,
            progress_fat
        FROM user_health_tracker
        WHERE user_id = ${userId}
        AND date = ${date}
    `;
    return result;
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
     getRecipesByCategory,
     getRecipesByName,
     addLikes
};
