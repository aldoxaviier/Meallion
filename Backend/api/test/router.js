const router = require("express").Router();
const supabase  = require("../../config/db");
const redisClient = require("../../utils/redis");

router.get("/", async (req, res) => {
    const data = await supabase.from("tes").select();
    res.json(data);
});

router.get("/redis", async (req, res) => {
    const result = await redisClient.get("otptoken");
    res.json({message: "Test endpoint", result});
});

router.post("/supabase", async (req, res) => {
    const supabase = await Database.getClient();
    const {name} = req.body;
    const result = await supabase.from("tes").insert({ name: name}).select();
    res.json({message: "Supabase test endpoint", result});
});

module.exports = router;