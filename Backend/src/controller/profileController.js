const ApiResponse = require("../utils/apiResponse");
const  profileRepository  = require("../repositories/profileRepository");
const profileService = require("../service/profileService");

const addProfile = async (req, res) => {
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
const addInteraction = async (req, res) => {
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
const getProfile = async (req, res) => {
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
const updateProfile = async (req, res) => {
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

const getProfileFromID = async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json(ApiResponse.error("user_id is required", 400));
        }
        const profile = await profileRepository.getProfile(user_id);
        if (!profile) {
            return res.status(404).json(ApiResponse.error("Profile not found", 404));
        }
        res.status(200).json(ApiResponse.success("Profile found", profile, 200));
    } catch (err) {
        console.error(err.message);
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}

const searchProfiles = async (req, res) => {
    try {
        const { query } = req.query;
        const profiles = await profileRepository.searchProfiles(query);
        res.status(200).json(ApiResponse.success("Profiles found", profiles, 200));
    } catch (err) {
        console.error(err.message);
        res.status(500).json(ApiResponse.error(err.message, 500));
    }
}

module.exports = { addProfile, addInteraction, getProfile, getProfileFromID, updateProfile, searchProfiles }