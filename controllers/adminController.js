const db = require("../config/db");

exports.getAdminSummary = async (req, res, next) => {
  try {
   
    const [userStats] = await db.query(`
      SELECT 
        COUNT(*) AS total_users,
        SUM(role = 'NORMAL') AS normal_users,
        SUM(role = 'VIP') AS vip_users,
        SUM(role = 'GUEST') AS guest_users
      FROM users
    `);

    
    const [contestStats] = await db.query(`
      SELECT 
        COUNT(*) AS total_contests,
        SUM(access_level = 'normal') AS normal_contests,
        SUM(access_level = 'vip') AS vip_contests
      FROM contests
    `);

    const [questionStats] = await db.query(`SELECT COUNT(*) AS total_questions FROM questions`);

    const [participationStats] = await db.query(`SELECT COUNT(DISTINCT user_id, contest_id) AS total_participations FROM user_answers`);

    const [topUsers] = await db.query(`
      SELECT u.id, u.name, SUM(l.score) AS total_score
      FROM leaderboard l
      JOIN users u ON l.user_id = u.id
      GROUP BY u.id
      ORDER BY total_score DESC
      LIMIT 3
    `);

    const [latestContests] = await db.query(`
      SELECT id, name, access_level, start_time, end_time, prize
      FROM contests
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.status(200).json({
      users: userStats[0],
      contests: contestStats[0],
      questions: questionStats[0].total_questions,
      participations: participationStats[0].total_participations,
      top_users: topUsers,
      latest_contests: latestContests,
    });
  } catch (err) {
    next(err);
  }
};
