const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/apiResponse");
require("dotenv").config();

module.exports = async(req,res,next) =>{
    try {
        const header = req.header("Authorization");
        let token = "";
        if(header && header.startsWith("Bearer ")){
            token = header.slice(7);
        }
        if(!header || !token){
            return res.status(403).json(ApiResponse.error("unauthorized", 403));
        }
        const payload = jwt.verify(token,process.env.AccessSecret);
        const userId = typeof payload.user === "string" ? payload.user : payload.user?.userId;

        // Keep backward compatibility: most controllers expect req.user to be the plain userId string.
        req.user = userId;
        // console.log("Bearer ", token)

        // Expose normalized auth context for endpoints that also need the token.
        req.userId = userId;
        req.token = token;
        req.auth = {
            userId,
            token,
        };
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(403).json(ApiResponse.error("unauthorized", 403));
    }
}