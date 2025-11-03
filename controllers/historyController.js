const db = require("../config/db");

exports.getUserHistory = async (req, res) => {
  try {
    const user_id = req.user.id;

    const [completed] = await db.query(
      `SELECT uh.contest_id, c.name AS contest_name, c.access_level AS contest_type, 
              uh.status, l.score, uh.prize_won
       FROM user_history uh
       JOIN contests c ON uh.contest_id = c.id
       LEFT JOIN leaderboard l ON l.contest_id = c.id AND l.user_id = uh.user_id
       WHERE uh.user_id = ? AND uh.status = 'completed'`,
      [user_id]
    );

    const [inProgress] = await db.query(
      `SELECT c.id AS contest_id, c.name AS contest_name, c.access_level AS contest_type, 
              uh.status
       FROM user_history uh
       JOIN contests c ON uh.contest_id = c.id
       WHERE uh.user_id = ? AND uh.status = 'in_progress'`,
      [user_id]
    );

    res.status(200).json({
      user_id,
      completed_history: completed,
      in_progress_contests: inProgress,
    });
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
