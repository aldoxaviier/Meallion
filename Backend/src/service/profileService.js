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
}

module.exports = { profileService };