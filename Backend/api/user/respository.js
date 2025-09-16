const Database = require("../../config/db");

class userRepository {
    static async createUser(email, name, password) {
        const result = await Database.from("users").insert({ email: email, password: password, name: name }).select();
        return result;
    }

    static async findEmailUnique(email) {
        const result = await Database.from("users").select("email").eq("email", email);
        return result;
    }

    static async updateRefreshToken(user_id, refresh_token) {
        const result = await Database.from("users").update({ refresh_token: refresh_token }).eq("user_id", user_id);
        return result;
    }

    static async findUserByEmail(email) {
        const result = await Database.from("users").select("*").eq("email", email);
        return result;
    }
}

module.exports = userRepository;