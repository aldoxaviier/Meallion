const ApiResponse = require("../utils/apiResponse");
const { profileRepository } = require("../repositories/profileRepository");
const { profileService } = require("../service/profileService");

class profileController {
    static async addProfile(req, res) {
        try {
            const userId = req.user;
            const {height, weight, activity_level, goal_plan, dislikes, dietaryRequirements: diet_preferences} = req.body;
            const response = await profileRepository.addProfile({userId, height, weight, activity_level, goal_plan, dislikes, diet_preferences});
            res.status(201).json(ApiResponse.success("Profile added successfully", response, 201));
        } catch (err) {
            console.error(err.message);
            res.status(500).json(ApiResponse.error(err.message, 500));
        }
    }
    static async addInteraction(req, res) {
        try {
            const userId = req.user;
            const { recipeId, interactionType } = req.body;
            const response = await profileService.addInteraction({ userId, recipeId, interactionType });
            res.status(201).json(ApiResponse.success("Interaction added successfully", response, 201));
        } catch (err) {
            console.error(err.message);
            res.status(500).json(ApiResponse.error(err.message, 500));
        }
    }

    static async getProfile(req, res) {
        try {
            const userId = req.user;
            const profile = await profileRepository.getProfile(userId);
            if (!profile) {
                return res.status(404).json(ApiResponse.error("Profile not found", 404));
            }

            res.status(201).json(
                ApiResponse.success("Profile found", profile, 201)
            )
    } catch (err) {
        console.error(err.message);
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
  }
}

module.exports = {profileController}