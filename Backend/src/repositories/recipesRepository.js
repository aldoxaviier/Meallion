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

const getRecipesByNameCategory = async (query, categories, firstPage, nextPage, isSocial = false) => {
    const conditions = [];

    if (query && query.trim() !== "") {
        const searchTerm = '%' + query.trim() + '%';
        if (isSocial) {
            conditions.push(sql`(recipes.name ILIKE ${searchTerm} OR recipes.author_name ILIKE ${searchTerm})`);
        } else {
            conditions.push(sql`recipes.name ILIKE ${searchTerm}`);
        }
    }

    if (Array.isArray(categories) && categories.length > 0) {
        categories.forEach(tag => {
            conditions.push(sql`tags ILIKE ${'%' + tag + '%'}`);
        });
    }

    if (isSocial) {
        conditions.push(sql`author_name != 'Meallion'`);
    }

    let whereClause = sql``;
    if (conditions.length > 0) {
        whereClause = sql`WHERE ${conditions.reduce((prev, curr) => sql`${prev} AND ${curr}`)}`;
    }
    
    const result = await sql`
        SELECT 
            recipes.*, 
            user_profiles.profile_image 
        FROM recipes
        LEFT JOIN user_profiles ON recipes.user_id = user_profiles.user_id
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
    const ids = [11078, 13678, 19859, 16849, 25815, 24747, 9557, 12339, 20480, 40857];
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
            r.recipe_id,
            r.name,
            r."Calories",
            r."TotalTime",
            r."Images",
            r."FatContent",
            r."CarbohydrateContent",
            r."ProteinContent",
            r."RecipeServings"
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
                r.*,
                up.profile_image
            FROM likes l
            JOIN recipes r ON l.recipe_id = r.recipe_id
            LEFT JOIN user_profiles up ON r.user_id = up.user_id
            WHERE l.user_id = ${userId}
        `;
    return result;
};

const addToMealPlan = async (data, userId) => {
    console.log("Data received in addToMealPlan repository:", data);
    const items = Array.isArray(data) ? data : [data];
    const normalizedItems = items.map(item => ({
        ...item,
        user_id: item.user_id ?? userId
    }));
    const values = normalizedItems.map(item => [
        item.user_id,
        item.recipe_id || item.recipeId,
        item.meal_time || item.mealType,
        item.date
    ]);
    const result = await sql`
        INSERT INTO mealplan (user_id, recipe_id, meal_time, date)
        VALUES ${sql(values)}
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

const addRecipe = async ({ 
    userId, name, authorName,
    prepTime, cookTime, totalTime, 
    description, recipeServings, 
    image, steps,
    calories, protein, 
    fat,carbohydrate,
    fiber,sodium,
    sugar,cholesterol,
    tags }) => {
    const result = await sql`
        INSERT INTO recipes (
            user_id,
            name,
            author_name,
            "CookTime",
            "PrepTime",
            "TotalTime",
            "DatePublished",
            "Description",
            "Images",
            "Calories",
            "FatContent",
            "CholesterolContent",
            "SodiumContent",
            "CarbohydrateContent",
            "FiberContent",
            "SugarContent",
            "ProteinContent",
            "RecipeServings",
            "RecipeInstructions",
            tags
        )
        VALUES (
            ${userId},
            ${name},
            ${authorName},
            ${cookTime},
            ${prepTime},
            ${totalTime},
            NOW(),
            ${description},
            ${image},
            ${calories},
            ${fat},
            ${cholesterol},
            ${sodium},
            ${carbohydrate},
            ${fiber},
            ${sugar},
            ${protein},
            ${recipeServings},
            ${steps},
            ${tags}
        )
        RETURNING *;
    `;
    console.log("addRecipe result:", result[0]);
     return result[0];
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

const getCategories = async () => {
    const result = await sql`
        SELECT * FROM categories
    `;
    return result;
}

const addIngredients = async (ingredients) => {
    const result = await sql`
    INSERT INTO ingredients_mapping (
        fdc_id, original_name, simplified_name,
        calories, protein, fat,
        carbohydrate, fiber, sodium,
        sugar, cholesterol
    )
    VALUES ${sql(ingredients.map(i => [
        i.fdcId,
        i.original_name,
        i.simplified_name,
        i.calories,
        i.protein,
        i.fat,
        i.carbohydrate,
        i.fiber,
        i.sodium,
        i.sugar,
        i.cholesterol
    ]))}
    RETURNING *;
    `;
    return result;
}

const addRecipeIngredients = async (recipeId, ingredients) => {
    const result = await sql`
        INSERT INTO recipe_ingredients(recipe_id, ingredient_id, quantity, unit)
        VALUES ${sql(ingredients.map(i => [
            recipeId,
            i.ingredientId,
            i.quantity,
            i.unit || 'g'
        ]))}
        RETURNING *;
    `;
    return result;
}

const getRecIngByRecipeId = async (recipeId) => {
    const result = await sql`
        SELECT ri.quantity, ri.unit, im.original_name
        FROM recipe_ingredients ri
        JOIN ingredients_mapping im ON ri.ingredient_id = im.id 
        WHERE ri.recipe_id = ${recipeId}
    `;
    return result;
}

const getRecipesByUser = async (userId) => {
    const result = await sql`
        SELECT 
        r.*,
        up.profile_image 
        FROM recipes r
        join user_profiles up on r.user_id = up.user_id
        WHERE r.user_id = ${userId}
    `;
    return result;
}

const bulkAddMealPlan = async (mealPlanRows) => {
    const result = await sql`
        INSERT INTO mealplan (user_id, recipe_id, meal_time, date)
        VALUES ${sql(mealPlanRows.map(row => [
            row.user_id,
            row.recipe_id,
            row.meal_time,
            row.date
        ]))}
        RETURNING *;
    `;
    return result;
};

const getRecipesByFollowing = async (query, categories, firstPage, nextPage, userId) => {
    const conditions = [];

    if (query && query.trim() !== "") {
        conditions.push(sql`name ILIKE ${'%' + query + '%'}`);
    }

    let whereClause = sql``;
    if (conditions.length > 0) {
        whereClause = sql`WHERE ${conditions.reduce((prev, curr) => sql`${prev} AND ${curr}`)}`;
    }
    
    const result = await sql`
        with recipes_owners as (
            SELECT
            *
            from user_relationships
            where follower_id = ${userId}
        )
        SELECT 
            recipes.*, 
            user_profiles.profile_image 
        FROM recipes
        JOIN recipes_owners ON recipes.user_id = recipes_owners.following_id
        LEFT JOIN user_profiles ON recipes.user_id = user_profiles.user_id
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

const deleteRecipe = async (userId, recipeId) => {
    const result = await sql`
        DELETE FROM recipes
        WHERE user_id = ${userId}
        AND recipe_id = ${recipeId}
        RETURNING *;
    `;

    return result;
}

const hasMealPlanForDate = async (userId, date) => {
    const result = await sql`
        SELECT 1 FROM mealplan
        WHERE user_id = ${userId} AND date = ${date}
        LIMIT 1;
    `;
    return result.length > 0;
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
    getCategories,
    addIngredients,
    addRecipeIngredients,
    getRecIngByRecipeId,
    getRecipesByUser,
    bulkAddMealPlan,
    getRecipesByFollowing,
    deleteRecipe,
    hasMealPlanForDate
};
