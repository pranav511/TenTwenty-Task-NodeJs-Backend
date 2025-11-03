const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getLeaderboard } = require("../controllers/leaderboardController");

router.get("/:contest_id", auth, getLeaderboard);

module.exports = router;
