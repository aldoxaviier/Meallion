const yup = require("yup");

const registerSchema = yup.object().shape({
    email: yup.string().email().required(),
    name: yup.string().required(),
    password: yup.string().min(6).max(15).required()
});

const loginSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(6).max(15).required()
});

const otpSchema = yup.object().shape({
    email: yup.string().email().required()
});

module.exports = {
    registerSchema,
    loginSchema,
    otpSchema
};
