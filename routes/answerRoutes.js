const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { submitAnswers } = require("../controllers/answerController");
const auth = require("../middleware/auth");

router.post(
  "/submit",
  auth,
  [
    body("contest_id").isInt().withMessage("Contest ID required"),
    body("answers").isArray({ min: 1 }).withMessage("Answers must be array"),
  ],
  submitAnswers
);

module.exports = router;
