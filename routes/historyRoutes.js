const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getUserHistory } = require("../controllers/historyController");

router.get("/", auth, getUserHistory);

module.exports = router;
