const { json } = require("../config/dbSql");
const recipesRepository = require("../repositories/recipesRepository")

const getRecipesByNameCategory = async (query, category, page = 1, limit = 10) => {
    const firstPage = (page - 1) * limit;
    const nextPage = firstPage + limit - 1;
    
    const categories = category ? category.split(',') : [];

    return await recipesRepository.getRecipesByNameCategory(
        query || "", 
        categories, 
        firstPage, 
        nextPage
    );
};

const addLikes = async (userId, recipeId) => {
    const alreadyExists = await recipesRepository.getLikesByUserId(userId, recipeId);
    if (alreadyExists.length > 0) {
        return { isDuplicate: true, message: "Recipe already liked by the user" };
    }
    const result = await recipesRepository.addLikes(userId, recipeId);
    return { isDuplicate: false, data: result };
}

const addReview = async (userId, recipeId, name, rating, review) => {
    await recipesRepository.addReview(userId, recipeId, name, rating, review)

    const ratingResult = await recipesRepository.getRatingTotal(recipeId);
    let rating_score = 0;
    
    if (ratingResult && ratingResult.length > 0) {
        const ratingTotal = ratingResult.reduce((curr, next) => curr + next.rating, 0);
        rating_score = parseFloat((ratingTotal / ratingResult.length).toFixed(1));
        console.log("Rating Total:", ratingTotal);
        console.log("Rating Score:", rating_score);
        await recipesRepository.updateRating(recipeId, rating_score, ratingResult.length);
    } 
    else {
        await recipesRepository.updateRating(recipeId, rating, 1)
    }
}

const getMealPlan = async (userId, date) => {
    const mealPlanData = await recipesRepository.getMealPlan(userId, date)
    const progressMeal = await recipesRepository.getProgressMeal(userId, date)
    return {
        mealPlanData,
        progressMeal
    }
}

const updateMealProgress = async (userId, mealIDs, date, progress_cal, progress_pro, progress_fat, progress_carbs) => {
    if (!mealIDs || mealIDs.length === 0) {
        throw new Error("Meal IDs cannot be empty");
    }
    await recipesRepository.updateMealPlan(userId, mealIDs);
    const progress = await recipesRepository.getProgressMeal(userId, date);
    if (progress) {
        const update_cal = progress.progress_cal + progress_cal;
        const update_pro = progress.progress_pro + progress_pro;
        const update_fat = progress.progress_fat + progress_fat;
        const update_carbs = progress.progress_carbs + progress_carbs;
        await recipesRepository.updateMealProgress(userId, date, update_cal, update_pro, update_fat, update_carbs);
        return;
    }
    await recipesRepository.addMealProgress(userId, date, progress_cal, progress_pro, progress_fat, progress_carbs);
}

const deleteMealPlan = async (userId, mealId, date, cal, pro, fat, carbs) => {
    const meal = await recipesRepository.getMealPlanById(userId, mealId);

    if (!meal) {
        throw new Error("Meal plan not found");
    }

    const wasEaten = meal.is_eaten === true;

    await recipesRepository.deleteMealPlan(userId, mealId);

    if (wasEaten) {
        await recipesRepository.updateMealProgress(userId, date, cal, pro, fat, carbs);
    }
}

const addRecipe = async (userId, {name, prepTime, cookTime, description,ingredients,steps}, req) => {
    const recipeImage = `assets/recipe/${req.file.filename}`;
    const ingredientsData = JSON.parse(ingredients);
    const ingredientsNames = ingredientsData.map(ingredient => ingredient.name.trim().toLowerCase());
    console.log("ingredientsNames", ingredientsNames);
    const response = await fetch(`${process.env.FAST_API_URL}/recipes/search-ingredients`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(
            ingredientsNames
        )
    });
    const data = await response.json();
    console.log("response", data);
    return recipeImage
}

module.exports = { getRecipesByNameCategory, addReview, getMealPlan, addLikes, updateMealProgress, deleteMealPlan, addRecipe };