const db = require("../config/db");

exports.addQuestion = async (req, res) => {
  try {
    const { contest_id, question_text, question_type, options, correct_option, points } = req.body;

    if (!contest_id || !question_text || !options || !correct_option)
      return res.status(400).json({ message: "Missing required fields" });

    if (question_type === "single" && Array.isArray(correct_option)) {
      return res.status(400).json({
        success: false,
        message: "Single type question cannot have multiple correct options"
      });
    }

    if (question_type === "multi" && !Array.isArray(correct_option)) {
      return res.status(400).json({
        success: false,
        message: "Multiple type question must have array of correct options"
      });
    }


    await db.query(
      `INSERT INTO questions (contest_id, question_text, question_type, options, correct_option, points)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        contest_id,
        question_text,
        question_type || "single",
        JSON.stringify(options),
        JSON.stringify(correct_option),
        points || 10,
      ]
    );

    res.status(201).json({ message: "Question added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
