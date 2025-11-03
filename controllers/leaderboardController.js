const db = require("../config/db");

exports.getLeaderboard = async (req, res) => {
  try {
    const contest_id = req.params.contest_id;

    const [contest] = await db.query(
      `SELECT id, name, access_level FROM contests WHERE id = ?`,
      [contest_id]
    );
    if (contest.length === 0)
      return res.status(404).json({ message: "Contest not found" });

    const [rows] = await db.query(
      `SELECT 
          l.user_id, 
          u.name AS user_name,
          l.score,
          l.rank_position,
          c.access_level AS contest_type
       FROM leaderboard l
       JOIN users u ON l.user_id = u.id
       JOIN contests c ON l.contest_id = c.id
       WHERE l.contest_id = ?
       ORDER BY l.rank_position ASC`,
      [contest_id]
    );

    res.status(200).json({
      contest_id,
      contest_name: contest[0].name,
      contest_type: contest[0].access_level,
      leaderboard: rows,
    });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
