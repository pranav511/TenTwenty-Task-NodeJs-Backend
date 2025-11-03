const db = require("../config/db");

exports.addQuestion = async (req, res) => {
  try {
    const { contest_id, question_text, question_type, options, correct_option, points } = req.body;

    if (!contest_id || !question_text || !options || !correct_option)
      return res.status(400).json({ message: "Missing required fields" });

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
