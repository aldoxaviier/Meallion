const { interactionValueConfig } = require("../config/interaction.config");
const { profileRepository } = require("../repositories/profileRepository");

class profileService {
    static async addInteraction({ userId, recipeId, interactionType }) {
        const interaction = await profileRepository.getInteractionByUserAndRecipe({ userId, recipeId});
        let score = interactionValueConfig[interactionType];
        if (interaction) {
            const updatedInteraction = await profileRepository.updateInteraction({ userId, recipeId, score });
            return updatedInteraction;
        } else {
            const newInteraction = await profileRepository.addInteraction({ userId, recipeId, score });
            return newInteraction;
        }
    }
}

module.exports = { profileService };