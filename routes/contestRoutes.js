const express = require("express");
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const authOptional = require("../middleware/authOptional");
const roleCheck = require("../middleware/roleCheck");
const { createContest, getContests } = require("../controllers/contestController");

const router = express.Router();

//  Validation helper
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.post(
  "/create",
  auth,
  roleCheck("admin"),
  [
    body("name").notEmpty().withMessage("Contest name required"),
    body("description").notEmpty().withMessage("Description required"),
    body("access_level").isIn(["normal", "vip"]).withMessage("Access level must be 'normal' or 'vip'"),
    body("start_time").notEmpty().withMessage("Start time required"),
    body("end_time").notEmpty().withMessage("End time required"),
  ],
  validate,
  createContest
);

router.get("/", authOptional, getContests);

module.exports = router;
