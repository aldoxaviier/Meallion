const ApiResponse = require("../utils/apiResponse");
const  profileRepository  = require("../repositories/profileRepository");
const { profileService } = require("../service/profileService");

class profileController {
    static async addProfile(req, res) {
        try {
            const userId = req.user;
            const {height, weight, activity : activity_level, goal : goal_plan, dislikes, dietaryRequirements: diet_preferences, birthdate, gender, healthCondition} = req.body;
            const response = await profileService.calculateUserRequirements(userId, height, weight, activity_level, goal_plan, dislikes, diet_preferences, birthdate, gender, healthCondition);
            res.status(201).json(ApiResponse.success("Profile added successfully", response, 201));
        } catch (err) {
            console.error(err.message);
            res.status(500).json(ApiResponse.error(err.message, 500));
        }
    }
    static async addInteraction(req, res) {
        try {
            const userId = req.user;
            const {interactions} = req.body;
            console.log("pppppp");
            const response = await profileService.addInteraction(userId,interactions);
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

            res.status(200).json(
                ApiResponse.success("Profile found", profile, 200)
            )
        } catch (err) {
            console.error(err.message);
            res.status(500).json(ApiResponse.error(err.message, 500));
        }
    }
    static async updateProfile(req, res) {
        try {
            const userId = req.user;
            const profile = req.body;
            console.log("file", req.file);
            console.log("body", req.body);
            const editedProfile = await profileService.updateProfile(userId, profile, req);
            res.status(200).json(ApiResponse.success("Profile updated successfully", editedProfile, 200));
        } catch (err) {
            console.error(err.message);
            res.status(500).json(ApiResponse.error(err.message, 500));
        }
    }
    static async updateDietPreferences(req, res) {
        try {
            const userId = req.user;
            const { diet_preferences } = req.body;
            const updatedProfile = await profileRepository.updateDietPreferences(userId, diet_preferences);
            res.status(200).json(ApiResponse.success("Diet preferences updated successfully", updatedProfile, 200));
        } catch (err) {
            console.error(err.message);
            res.status(500).json(ApiResponse.error(err.message, 500));
        }
    }
}

module.exports = {profileController}