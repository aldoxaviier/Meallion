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
            res.status(403).json(ApiResponse.error("unauthorized", 403));
        }
        const payload = jwt.verify(token,process.env.AccessSecret);
        req.user = payload.user;
        next();
    } catch (err) {
        console.error(err.message);
        res.status(403).json(ApiResponse.error("unauthorized", 403));
    }
}