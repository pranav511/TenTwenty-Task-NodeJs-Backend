const db = require("../config/db");

exports.submitAnswers = async (req, res) => {
  try {
    const user_id = req.user.id; 
    const { contest_id, answers } = req.body;

    if (!contest_id || !answers)
      return res.status(400).json({ message: "Missing required fields" });

   
    const [contestInfo] = await db.query(
      `SELECT access_level FROM contests WHERE id = ?`,
      [contest_id]
    );
    const contest_type = contestInfo?.[0]?.access_level || "normal";

    let total_score = 0;
    let resultDetails = [];

    for (const ans of answers) {
      const { question_id, selected_option } = ans;

      const [questionData] = await db.query(
        `SELECT question_type, correct_option, points FROM questions WHERE id = ? AND contest_id = ?`,
        [question_id, contest_id]
      );

      if (questionData.length === 0) continue;

      const q = questionData[0];

      let correctOpt;
      try {
        correctOpt = JSON.parse(q.correct_option);
      } catch {
        correctOpt = q.correct_option;
      }

      let isCorrect = false;

      if (q.question_type === "single") {
        if (selected_option === correctOpt) isCorrect = true;
      } else if (q.question_type === "multi") {
        const selectedArr = Array.isArray(selected_option)
          ? selected_option.map(String).sort()
          : [];

        let correctArr = [];
        if (Array.isArray(correctOpt)) {
          correctArr = correctOpt.map(String).sort();
        } else if (typeof correctOpt === "string") {
          correctArr = correctOpt.split(",").map(v => v.trim()).sort();
        }

        isCorrect = JSON.stringify(selectedArr) === JSON.stringify(correctArr);
      }

      const gained = isCorrect ? q.points : 0;
      total_score += gained;

      await db.query(
        `INSERT INTO user_answers (user_id, contest_id, question_id, selected_option_ids)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE selected_option_ids = VALUES(selected_option_ids)`,
        [user_id, contest_id, question_id, JSON.stringify(selected_option)]
      );

      resultDetails.push({
        question_id,
        selected_option,
        correct_option: correctOpt,
        is_correct: isCorrect,
        points_gained: gained,
      });
    }

    await db.query(
      `INSERT INTO leaderboard (user_id, contest_id, score)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE score = ?`,
      [user_id, contest_id, total_score, total_score]
    );

    const [leaders] = await db.query(
      `SELECT id FROM leaderboard WHERE contest_id = ? ORDER BY score DESC`,
      [contest_id]
    );

    for (let i = 0; i < leaders.length; i++) {
      await db.query(`UPDATE leaderboard SET rank_position = ? WHERE id = ?`, [
        i + 1,
        leaders[i].id,
      ]);
    }

    
    const [topUser] = await db.query(
      `SELECT user_id FROM leaderboard WHERE contest_id = ? ORDER BY score DESC LIMIT 1`,
      [contest_id]
    );

    let prize;
    if (topUser.length > 0 && topUser[0].user_id === user_id) {
      prize = contest_type === "vip" ? "₹2000" : "₹500";
    } else {
      prize = "No Prize";
    }

    await db.query(
      `INSERT INTO user_history (user_id, contest_id, prize_won, status)
       VALUES (?, ?, ?, 'completed')
       ON DUPLICATE KEY UPDATE prize_won = ?, status = 'completed'`,
      [user_id, contest_id, prize, prize]
    );

    await db.query(
      `UPDATE users SET total_score = total_score + ? WHERE id = ?`,
      [total_score, user_id]
    );

    res.status(200).json({
      message: "Answers submitted successfully",
      contest_type,
      total_score,
      prize,
      details: resultDetails,
    });
  } catch (error) {
    console.error("Error submitting answers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
