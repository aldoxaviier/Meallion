const redis = require("redis");

const redisClient = redis.createClient({
    password: process.env.Redis_Password,
    pingInterval: 30000,
    socket: {
        host: process.env.Redis_Host,
        port: process.env.Redis_Port,
        connectTimeout: 10000,
        keepAlive: 10000,
        reconnectStrategy: (retries) => {
            return Math.min(retries * 100, 3000);
        }
    }
});

redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err.message);
});

redisClient.on("reconnecting", () => {
    console.log("Redis reconnecting...");
});

redisClient.on("connect", () => {
    console.log("Redis connected");
});

module.exports = { redisClient };