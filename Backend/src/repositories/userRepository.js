const Database = require("../config/db");

const createUser = async (email, name, password) => {
    const result = await Database.from("users").insert({ email: email, password: password, name: name }).select();
    return result;
}

const findEmailUnique = async (email) => {
    const result = await Database.from("users").select("email").eq("email", email);
    return result;
}

const updateRefreshToken = async (user_id, refresh_token) => {
    const result = await Database.from("users").update({ refresh_token: refresh_token }).eq("user_id", user_id);
    return result;
}

const deleteRefreshToken = async (user_id) => {
    await Database.from("users").update({ refresh_token: null }).eq("user_id", user_id);
}

const findUserByEmail = async (email) => {
    const result = await Database.from("users").select("*").eq("email", email);
    return result;
}

const findUserRefreshToken = async (refreshToken) => {
    const result = await Database.from("users").select("*").eq("refresh_token", refreshToken);
    return result;
}
const updateUser = async (user_id, user) => {
    const result = await Database.from("users").update(user).eq("user_id", user_id).select();
    return result.data;
}

module.exports = {
    createUser,
    findEmailUnique,
    updateRefreshToken,
    deleteRefreshToken,
    findUserByEmail,
    findUserRefreshToken,
    updateUser
};