const { interactionValueConfig } = require("../config/interaction.config");
const { profileRepository } = require("../repositories/profileRepository");

class profileService {
    static async addInteraction(userId, interactions) {
        const results = [];
        for (const item of interactions) {
            const { recipeId, interactionType } = item;
            const score = interactionValueConfig[interactionType];

            const existingInteraction =
                await profileRepository.getInteractionByUserAndRecipe({
                    userId,
                    recipeId,
                });

            if (existingInteraction) {
                const updated =
                    await profileRepository.updateInteraction({
                        userId,
                        recipeId,
                        score,
                    });
                results.push(updated);
            } else {
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