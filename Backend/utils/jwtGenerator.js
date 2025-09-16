const jwt = require("jsonwebtoken");

const accessToken= (user_id) =>{
    const payload = {
        user: user_id
    }
    return jwt.sign(payload, process.env.AccessSecret, { expiresIn: 120 });
}

const refreshToken = (user_id) =>{
    const payload = {
        user: user_id
    }
    return jwt.sign(payload, process.env.RefreshSecret, { expiresIn: 300 });
}

module.exports = { accessToken, refreshToken };