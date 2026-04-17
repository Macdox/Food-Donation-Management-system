const express = require("express");
const authrouter = require("./AuthRouter");

const router = express.Router();

router.use("/auth", authrouter);

module.exports = router;
