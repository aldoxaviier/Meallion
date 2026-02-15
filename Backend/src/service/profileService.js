const { interactionValueConfig } = require("../config/interaction.config");
const { profileRepository } = require("../repositories/profileRepository");

class profileService {
    static async addInteraction(userId, interactions) {
        const results = [];
        console.log("service", interactions);
        for (let item of interactions) {
            const { recipe_id : recipeId, interaction } = item;
            const score = interactionValueConfig[interaction];

            const existingInteraction =
                await profileRepository.getInteractionByUserAndRecipe({
                    userId,
                    recipeId,
                });
            console.log("existing", existingInteraction);
            if (existingInteraction.length > 0) {
                console.log("updating existing interaction");
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

    static async calculateUserRequirements(userId, height, weight, activity_level, goal_plan, dislikes, diet_preferences, birthdate,gender, healthCondition,) {
        const tdee = this.tdeeCalculator(height, weight, activity_level, birthdate, gender);
        let caloricIntake;
        if (goal_plan === "Lose Weight") {
            caloricIntake = Math.round(tdee - 500);
        } else if (goal_plan === "Gain Weight") {
            caloricIntake = Math.round(tdee + 500);
        } else {
            caloricIntake = Math.round(tdee);
        }
        const macros = this.dietaryGroupsCalculator(caloricIntake, healthCondition);
        console.log("here calculator");
        const profileData = await profileRepository.addProfile({userId, height, weight, activity_level, goal_plan, dislikes, diet_preferences, birthdate, gender, healthCondition, target_calories: caloricIntake, target_carbs: macros.carbohydrates, target_proteins: macros.proteins, target_fats: macros.fats, updated_at: new Date()});
        return profileData;
    }

    static dietaryGroupsCalculator(caloricIntake, healthCondition) {
        if (healthCondition === "diabetes") {
            return {
                carbohydrates: Math.round(caloricIntake * 0.30 / 4),
                proteins: Math.round(caloricIntake * 0.25 / 4),
                fats: Math.round(caloricIntake * 0.45 / 9),
            }
        } else {
            return {
                carbohydrates: Math.round(caloricIntake * 0.30 / 4),
                proteins: Math.round(caloricIntake * 0.35 / 4),
                fats: Math.round(caloricIntake * 0.35 / 9),
            }
        }
    }

    static tdeeCalculator(height, weight, activity_level, birthdate, gender) {
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

}

module.exports = { profileService };