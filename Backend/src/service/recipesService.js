const recipesRepository = require("../repositories/recipesRepository")
const userRepository = require("../repositories/userRepository");
const cloudinary = require("../config/cloudinary");


const getRecipesByNameCategory = async (query, category, page = 1, limit = 10, isSocial) => {
    const firstPage = (page - 1) * limit;
    const nextPage = firstPage + limit - 1;
    
    const categories = category ? category.split(',') : [];

    return await recipesRepository.getRecipesByNameCategory(
        query || "", 
        categories, 
        firstPage, 
        nextPage,
        isSocial
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

const addRecipe = async (userId, {name, prepTime, cookTime, description, recipeServings, ingredients, steps, tags}, req) => {
    const image = await cloudinary.uploadCloudinary(req.file.buffer, "recipes");
    const imageUrl = image.secure_url;
    const cloudinaryId = image.public_id;
    const parsedIngredients = parseMaybeJson(ingredients);
    const existingIngredients = parsedIngredients
        .filter(i => i.ingredientId)
        .map(i => ({ ingredientId: i.ingredientId, quantity: i.qty }));

    const newIngredients = parsedIngredients.filter(i => !i.ingredientId);
    console.log("newIngredients", newIngredients);
    let newIngredientIds = [];
    if (newIngredients.length > 0) {
        const inserted = await recipesRepository.addIngredients(newIngredients);
        newIngredientIds = inserted.map(row => {
            const original = newIngredients.find(i => i.fdc_id === row.fdcId);
            return {
                ingredientId: row.id,
                quantity: original?.qty ?? 0
            };
        });
    }

    const allIngredientRelationships = [...existingIngredients, ...newIngredientIds];
    console.log("allIngredientRelationships", allIngredientRelationships);
    const parsedSteps = parseMaybeJson(steps);
    const formattedTags = tags.split(',').map(tag => tag.trim()).join(' | ');
    const nutritionTotals = calculateNutritionTotals(parsedIngredients);
    const authorData = await userRepository.getUserById(userId);
    const body ={
        userId,
        name,
        authorName: authorData,
        prepTime: toHourMinute(Number(prepTime)),
        cookTime: toHourMinute(Number(cookTime)),
        totalTime: toHourMinute(Number(prepTime) + Number(cookTime)),
        description,
        recipeServings,
        image: imageUrl,
        steps: parsedSteps.map(step => step.description.trim()).join("., "),
        calories: nutritionTotals.calories,
        protein: nutritionTotals.protein,
        fat: nutritionTotals.fat,
        carbohydrate: nutritionTotals.carbohydrate,
        fiber: nutritionTotals.fiber,
        sodium: nutritionTotals.sodium,
        sugar: nutritionTotals.sugar,
        cholesterol: nutritionTotals.cholesterol,
        tags: formattedTags,
        cloudinary_id: cloudinaryId
    }
    console.log("body", body);
    const result = await recipesRepository.addRecipe(body);
    const recipeId = result.recipe_id;
    await recipesRepository.addRecipeIngredients(recipeId, allIngredientRelationships);
    return result;
}

const searchIngredients = async (query) => {
    let localResults = await recipesRepository.getIngredients(query);
    let usdaResults = [];

    if (localResults.length <= 4) {
        const response = await fetch(
            `${process.env.FAST_API_URL}/recipes/search-ingredients`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( query )
            }
        );

        const data = await response.json();
        usdaResults = data.data || [];
    }
    const localFdcIds = new Set(
        localResults
            .map(item => item.fdc_id)
            .filter(Boolean)
    );
    const filteredUsda = usdaResults.filter(item => {
        return item.fdcId && !localFdcIds.has(item.fdcId);
    });
    const combined = [...localResults, ...filteredUsda];
    return combined;
};

const parseMaybeJson = (value) => {
    if (Array.isArray(value) || (value && typeof value === "object")) {
        return value;
    }

    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        } catch (error) {
            return value;
        }
    }

    return value;
};

const toHourMinute = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

const calculateNutritionTotals = (ingredients = []) => {
    const totals = {
        calories: 0,
        protein: 0,
        fat: 0,
        carbohydrate: 0,
        fiber: 0,
        sodium: 0,
        sugar: 0,
        cholesterol: 0,
    };

    for (const ingredient of ingredients) {
        const qtyGram = Number(ingredient.qty);
        if (qtyGram <= 0) {
            continue;
        }

        const multiplier = qtyGram / 100;
        totals.calories += Number(ingredient.calories) * multiplier;
        totals.protein += Number(ingredient.protein) * multiplier;
        totals.fat += Number(ingredient.fat) * multiplier;
        totals.carbohydrate += Number(ingredient.carbohydrate) * multiplier;
        totals.fiber += Number(ingredient.fiber) * multiplier;
        totals.sodium += Number(ingredient.sodium) * multiplier;
        totals.sugar += Number(ingredient.sugar) * multiplier;
        totals.cholesterol += Number(ingredient.cholesterol) * multiplier;
    }

    return {
        calories: Number(totals.calories.toFixed(2)),
        protein: Number(totals.protein.toFixed(2)),
        fat: Number(totals.fat.toFixed(2)),
        carbohydrate: Number(totals.carbohydrate.toFixed(2)),
        fiber: Number(totals.fiber.toFixed(2)),
        sodium: Number(totals.sodium.toFixed(2)),
        sugar: Number(totals.sugar.toFixed(2)),
        cholesterol: Number(totals.cholesterol.toFixed(2)),
    };
};

const generateMealplan = async (
  userId,
  token,
  {
    allergies,
    diet_preferences,
    target_calories,
    target_proteins,
    target_carbs,
    target_fats,
    health_condition,
    days
  }
) => {
    console.log("Generating meal plan with params:", {
    userId,
    allergies,
    diet_preferences,
    target_calories,
    target_proteins,
    target_carbs,
    target_fats,
    health_condition,
    days
    });

    const response = await fetch(
    `${process.env.FAST_API_URL}/recommendation/generate-meal-plan`,
    {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
        allergies,
        diet_preferences,
        target_calories,
        target_proteins,
        target_carbs,
        target_fats,
        health_condition,
        days
        })
    }
    );
    const data = await response.json();
    const mealPlan = data.data;
    const rows = [];
    console.log("Received meal plan from API:", mealPlan);
    for (const dayPlan of mealPlan) {
        for (const [mealTime, meal] of Object.entries(dayPlan.meals)) {
            rows.push({
            user_id: userId,
            recipe_id: meal.recipe_id,
            meal_time: mealTime,
            date: new Date().toLocaleDateString("en-CA"),
            is_eaten: false
            });
        }
    }
    const result = await recipesRepository.addToMealPlan(rows);
    return data.data;
};

module.exports = { getRecipesByNameCategory, addReview, getMealPlan, addLikes, updateMealProgress, deleteMealPlan, addRecipe, searchIngredients, generateMealplan };