const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

(async()=>{
  try {
    const conn = await db.getConnection();
    console.log("MySQL Database Connected Successfully");
    conn.release();
  } catch (err) {
    console.error("MySQL Connection Failed:", err.message);
  }
})();

module.exports = db;
