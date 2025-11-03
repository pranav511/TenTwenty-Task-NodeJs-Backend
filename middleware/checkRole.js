module.exports = (role) => (req, res, next) => {
  if (req.user && req.user.role === role) {
    next();
  } else {
    res.status(403).json({ error: "Access denied. Admins only." });
  }
};
