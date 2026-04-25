const express = require("express");
const authrouter = require("./AuthRouter");
const donation = require("./donationRouter");

const router = express.Router();

router.use("/auth", authrouter);
router.use("/donations", donation);
module.exports = router;
