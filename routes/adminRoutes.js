const express = require("express");
const router = express.Router();
const { getAdminSummary } = require("../controllers/adminController");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

//  Only Admin can access summary
router.get("/summary", auth, checkRole("admin"), getAdminSummary);

module.exports = router;
