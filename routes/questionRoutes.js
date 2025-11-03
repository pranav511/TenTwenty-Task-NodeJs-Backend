const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { addQuestion } = require("../controllers/questionController");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/checkRole");

router.post(
  "/add",
  auth,
  checkRole("admin"),
  [
    body("contest_id").isInt().withMessage("Contest ID required"),
    body("question_text").notEmpty().withMessage("Question text required"),
    body("options")
      .isArray({ min: 2 })
      .withMessage("Options must be an array (min 2)"),
    body("correct_option").notEmpty().withMessage("Correct option required"),
    body("points").isInt().withMessage("Points must be a number"),
  ],
  addQuestion
);

module.exports = router;
