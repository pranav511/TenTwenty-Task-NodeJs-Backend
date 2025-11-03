module.exports = (req, res, next) => {
  const user = req.user; 
  const contestType = req.contestType || req.body.contest_type || req.params.type;

  if (user.role === "guest" && req.method === "POST") {
    return res.status(403).json({
      success: false,
      message: "Guest users can only view contests. Participation is restricted.",
    });
  }

  if (user.role === "normal" && contestType === "vip") {
    return res.status(403).json({
      success: false,
      message: "Normal users cannot access VIP contests.",
    });
  }

  next();
};
