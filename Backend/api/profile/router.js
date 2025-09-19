const router = require("express").Router();
const { userController } = require("./controller");
const validation = require("../../middleware/validations");
const authorization = require("../../middleware/authorization");