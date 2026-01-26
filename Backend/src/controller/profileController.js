const ApiResponse = require("../utils/apiResponse");
const { profileRepository } = require("../repositories/profileRepository");
const { profileService } = require("../service/profileService");

class profileController {
    static async addProfile(req, res) {
        try {
            const userId = req.user;
            const {height, weight, activity_level, goal_plan, allergies, diet_preferences, updated_at} = req.body;
            const response = await profileRepository.addProfile({userId, height, weight, activity_level, goal_plan, allergies, diet_preferences, updated_at});
            res.status(201).json(ApiResponse.success("Profile added successfully", response, 201));
        } catch (err) {
            console.error(err.message);
            res.status(500).json(ApiResponse.error(err.message, 500));
        }
    }
    static async addInteraction(req, res) {
        try {
            const userId = req.user;
            const { recipeId } = req.body;
            const response = await profileRepository.addInteraction({ userId, recipeId });
            res.status(201).json(ApiResponse.success("Interaction added successfully", response, 201));
        } catch (err) {
            console.error(err.message);
            res.status(500).json(ApiResponse.error(err.message, 500));
        }
    }
}

module.exports = {profileController}