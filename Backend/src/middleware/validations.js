const ApiResponse = require("../utils/apiResponse");

const validation = (schema) => async (req, res, next) => {
    try {
        const body = req.body;
        await schema.validate(body);
        next();
    } catch (err) {
        console.error(err.message);
        res.status(400).json(ApiResponse.error(err.message, 400));
    }
}

module.exports =  validation ;