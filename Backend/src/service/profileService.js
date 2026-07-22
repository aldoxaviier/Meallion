const { interactionValueConfig } = require("../config/interaction.config");
const profileRepository = require("../repositories/profileRepository");
const fs = require('fs');
const path = require('path');
const userRepository = require("../repositories/userRepository");
const cloudinary = require("../config/cloudinary");
const addInteraction = async (userId, interactions) => {
    const results = [];
    console.log("service", interactions);
    for (let item of interactions) {
        const { recipe_id : recipeId, interaction } = item;
        let score = interactionValueConfig[interaction];

        const existingInteraction =
            await profileRepository.getInteractionByUserAndRecipe({
                userId,
                recipeId,
            });
        console.log("existing", existingInteraction);
        if (existingInteraction) {
            console.log("updating existing interaction");
            score = existingInteraction.score + score;
            const updated =
                await profileRepository.updateInteraction({
                    userId,
                    recipeId,
                    score,
                });
            results.push(updated);
        } else {
            console.log("creating new interaction");
            console.log("userId:", userId, "recipeId:", recipeId, "score:", score);
            const created =
                await profileRepository.addInteraction({
                    userId,
                    recipeId,
                    score,
                });
            results.push(created);
        }
    }
    return results; 
}

const calculateUserRequirements = async (userId, height, weight, activity_level, goal_plan, dislikes, diet_preferences, birthdate,gender, healthCondition) => {
    const tdee = tdeeCalculator(height, weight, activity_level, birthdate, gender);
    let caloricIntake;
    if (goal_plan === "Lose Weight") {
        caloricIntake = Math.round(tdee - 500);
    } else if (goal_plan === "Gain Weight") {
        caloricIntake = Math.round(tdee + 500);
    } else {
        caloricIntake = Math.round(tdee);
    }
    const macros = dietaryGroupsCalculator(caloricIntake, healthCondition);
    console.log("here calculator");
    const profileexists = await profileRepository.getProfile(userId);
    let profileData;
    if(profileexists){
        profileData = await profileRepository.updateProfile(userId, {target_calories: caloricIntake, target_carbs: macros.carbohydrates, target_proteins: macros.proteins, target_fats: macros.fats, updated_at: new Date()});
    } else {
        profileData = await profileRepository.addProfile({userId, height, weight, activity_level, goal_plan, dislikes, diet_preferences, birthdate, gender, healthCondition, target_calories: caloricIntake, target_carbs: macros.carbohydrates, target_proteins: macros.proteins, target_fats: macros.fats, updated_at: new Date()});
    }
    return profileData;
}

const dietaryGroupsCalculator = (caloricIntake, healthCondition) => {
    //mclp
    if (healthCondition === "diabetes") {
        return {
            carbohydrates: Math.round(caloricIntake * 0.30 / 4),
            proteins: Math.round(caloricIntake * 0.25 / 4),
            fats: Math.round(caloricIntake * 0.45 / 9),
        }
    //vlchp
    } else if (healthCondition === "blood-pressure") {
        return {
            carbohydrates: Math.round(caloricIntake * 0.10 / 4),
            proteins: Math.round(caloricIntake * 0.30 / 4),
            fats: Math.round(caloricIntake * 0.60 / 9),
        }
    } else {
        return {
            carbohydrates: Math.round(caloricIntake * 0.30 / 4),
            proteins: Math.round(caloricIntake * 0.35 / 4),
            fats: Math.round(caloricIntake * 0.35 / 9),
        }
    }
}

const tdeeCalculator = (height, weight, activity_level, birthdate, gender) => {
    const age = Math.floor((new Date() - new Date(birthdate).getTime()) / 3.15576e+10);
    let bmr;
    if(gender === 'Male'){
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    }else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
    const tdee = Math.round(bmr * activity_level);
    return tdee;
}

const updateProfile = async (userId, profile, req) => {
    let imageUrl;
    let cloudinaryId;
    if(req.file){
        const result = await cloudinary.uploadCloudinary(req.file.buffer, "profiles");
        imageUrl = result.secure_url;
        cloudinaryId = result.public_id;
        const existingProfile = await profileRepository.getProfile(userId);
        console.log("existing profile:", existingProfile);
        if(existingProfile.profile_image){
            await cloudinary.deleteFromCloudinary(existingProfile.cloudinary_id);
        }
    }

    if (imageUrl) profile.profile_image = imageUrl;
    if (cloudinaryId) profile.cloudinary_id = cloudinaryId;


    const updateData = {};
    for(const [key, value] of Object.entries(profile)){
        if(value !== undefined && value !== null){
            updateData[key] = value;
        }
    }
    updateData.updated_at = new Date();
    const { name, ...updateDataPrev } = updateData;
    if(name){
        const userUpdateData = {name};
        await userRepository.updateUser(userId, userUpdateData);
    }
    await profileRepository.updateProfile(userId, updateDataPrev);
    const fullProfile = await profileRepository.getProfile(userId);
    await calculateUserRequirements(userId, fullProfile.height, 
        fullProfile.weight, fullProfile.activity_level, fullProfile.goal_plan, 
        fullProfile.dislikes, fullProfile.diet_preferences, 
        fullProfile.birthdate, fullProfile.gender, fullProfile.health_condition);
    return fullProfile;
}

module.exports = { addInteraction, calculateUserRequirements, dietaryGroupsCalculator, tdeeCalculator, updateProfile };