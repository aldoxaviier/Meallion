const recipesRepository = require("../repositories/recipesRepository")

const getRecipesByNameCategory = async (query, category, page = 1, limit = 10) => {
    const firstPage = (page - 1) * limit;
    const nextPage = firstPage + limit - 1;
    
    if (query && !category) {
        const result = await recipesRepository.getRecipesByName(query, firstPage, nextPage)
        return result
    }
    else if (!query && category) {
        const categories = category.split(',')
        const result = await recipesRepository.getRecipesByCategory(categories, firstPage, nextPage)
        return result
    }
    else {
        const categories = category.split(',')
        const result = await recipesRepository.getRecipesByNameCategory(query, categories, firstPage, nextPage)
        return result
    }
}

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
    const { data, count, error } = ratingResult;
    let rating_score = 0;

    if (error) {
        throw new Error("Gagal mengambil data rating: " + error.message);
    }
    
    if (data && count > 0) {
        const ratingTotal = data.reduce((acc, item) => acc + item.rating, 0);
        rating_score = parseFloat((ratingTotal / (count)).toFixed(1));
        await recipesRepository.updateRating(recipeId, rating_score, count);
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

const searchIngredients = async (query) => {
    const result = await recipesRepository.getIngredients(query);
    if(!result){
        const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search`,{
            method: "GET",
            params: {
                api_key: process.env.USDA_API_KEY,
                query: query,
                pageSize: 10,
                pageNumber: 1,
                dataType: ["Foundation", "SR Legacy"]
            }
        })
        const data = await response.json();
        return data;
    }
}

module.exports = { getRecipesByNameCategory, addReview, getMealPlan, searchIngredients, addLikes };