const redis = require("redis");

const redisClient = redis.createClient({
    password: process.env.Redis_Password,
    socket: {
        host: process.env.Redis_Host,
        port: process.env.Redis_Port
    }
});

module.exports = { redisClient };