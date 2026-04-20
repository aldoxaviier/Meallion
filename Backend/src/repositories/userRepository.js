const Database = require("../config/db");
const sql = require("../config/dbSql");

const createUser = async (email, name, password) => {
    const result = await sql`
        INSERT INTO users (email, password, name)
        VALUES (${email}, ${password}, ${name})
        RETURNING *
    `;
    return result[0];
}

const findEmailUnique = async (email) => {
    const result = await sql`
        SELECT * FROM users WHERE email = ${email}
    `;
    return result[0];
}

const updateRefreshToken = async (user_id, refresh_token) => {
    console.log("Updating refresh token for user_id:", user_id);
    const result = await sql`
        UPDATE users SET refresh_token = ${refresh_token} WHERE user_id = ${user_id}
    `;
    return result[0];
}

const deleteRefreshToken = async (user_id) => {
    const result = await sql`
        UPDATE users SET refresh_token = null WHERE user_id = ${user_id}
    `;
    return result[0];
}

const findUserByEmail = async (email) => {
    try {
        const result = await sql`
            SELECT * FROM users WHERE email = ${email}
        `;
        return result[0];
    } catch (err) {
        console.error("Error in findUserByEmail:", err);
        throw err;
    }
}

const findUserRefreshToken = async (refreshToken) => {
    const result = await sql`
        SELECT * FROM users WHERE refresh_token = ${refreshToken}
    `;

    return result[0];
}

const updateUser = async (user_id, user) => {
    const keys = Object.keys(user);
    const result = await sql`
        UPDATE users SET ${sql(user, keys)}
        WHERE user_id = ${user_id}
        RETURNING *
    `;

    return result[0];
}

const getUserById = async (userId) => {
    const result = await sql`
        SELECT name FROM users WHERE user_id = ${userId}
    `;
    return result[0].name;
};

const getUserRelationship = async (userId, targetUserId) => {
    const result = await sql`
        SELECT * FROM user_relationships 
        WHERE follower_id = ${userId} AND following_id = ${targetUserId}
    `;
    return result[0];
};

const updateFollowStatus = async (userId, targetUserId, follow) => {
    if (follow) {
        await sql`
            INSERT INTO user_relationships (follower_id, following_id) VALUES (${userId}, ${targetUserId})
        `;
    } else {
        await sql`
            DELETE FROM user_relationships WHERE follower_id = ${userId} AND following_id = ${targetUserId}
        `;
    }
};


module.exports = {
    createUser,
    findEmailUnique,
    updateRefreshToken,
    deleteRefreshToken,
    findUserByEmail,
    findUserRefreshToken,
    updateUser,
    getUserById,
    getUserRelationship,
    updateFollowStatus
};