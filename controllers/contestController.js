const db = require("../config/db");

exports.createContest = async (req, res, next) => {
  try {
    const { name, description, access_level, start_time, end_time, prize } = req.body;
    const created_by = req.user.id;

    const sql = `
      INSERT INTO contests (name, description, access_level, start_time, end_time, prize, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [name, description, access_level, start_time, end_time, prize, created_by]);

    res.json({ message: "Contest created successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getContests = async (req, res, next) => {
  try {
    const role = req.user?.role || "guest";

    let sql;
    if (role === "admin" || role === "vip") {
      sql = "SELECT * FROM contests ORDER BY start_time DESC";
    } else if (role === "user") {
      
      sql = "SELECT * FROM contests WHERE access_level = 'normal' ORDER BY start_time DESC";
    } else {
      
      sql = `
        SELECT id, name, description, access_level, start_time, end_time, prize 
        FROM contests 
        ORDER BY start_time DESC
      `;
    }

    const [contests] = await db.query(sql);
    res.json({
      success: true,
      role,
      total: contests.length,
      contests,
    });
  } catch (err) {
    next(err);
  }
};
