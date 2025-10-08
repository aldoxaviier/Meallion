const ApiResponse = require("../utils/apiResponse");
const { profileRepository } = require("../repositories/profileRepository");

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
}

module.exports = {profileController}