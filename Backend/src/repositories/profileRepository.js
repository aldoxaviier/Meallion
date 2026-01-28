const Database = require("../config/db");

class profileRepository {
    static async addProfile(data) {
        const result = await Database.from("user_profiles").insert(
            {user_id: data.userId, height: data.height, 
            weight: data.weight, activity_level: data.activity_level, 
            goal_plan: data.goal_plan, allergies: data.allergies, 
            diet_preferences: data.diet_preferences, updated_at: data.updated_at});
        return result;
    }
    static async getProfile(userId) {
        const result = await Database
                            .from('user_profiles')
                            .select(`
                                *,
                                users(
                                 name,
                                 email
                                )
                                `)
                            .eq("user_id", userId)
        return result
    }
}

module.exports = { profileRepository };