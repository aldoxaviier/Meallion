const Database = require("../config/db");

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

    static async deleterefreshtoken(user_id) {
        await Database.from("users").update({ refresh_token: null }).eq("user_id", user_id);
    }

    static async findUserByEmail(email) {
        const result = await Database.from("users").select("*").eq("email", email);
        return result;
    }

    static async findUserRefreshToken(refreshToken) {
        const result = await Database.from("users").select("*").eq("refresh_token", refreshToken);
        return result;
    }
    static async updateUser(user_id, user) {
        const result = await Database.from("users").update(user).eq("user_id", user_id).select();
        return result.data;
    }
}

module.exports = userRepository;