const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const contestRoutes = require("./routes/contestRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const historyRoutes = require("./routes/historyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message:{
    status: 429,
    error: "Too many requests. Please try again after a minute.",
  },
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/admin", adminRoutes);

// Health checkup
app.get("/", (req, res) => res.send("Contest System API Running"));

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
