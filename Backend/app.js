const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const PORT = process.env.PORT;
const { redisClient } = require("./utils/redis");

redisClient.connect(console.log("Redis Connected Successfully")).catch(console.error);

app.use(cors());
app.use(express.json());

app.use("/auth", require("./api/user/router"));
//app.use("/profile",require("./api/profile/router"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
