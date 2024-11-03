function checkNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated() || !req.user) {
    return next();
  } else {
    return res.status(403).json({ message: "Already logged in. Redirecting to home." });
  }
}

function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user) {
    return next();
  } else {
    return res.status(401).json({ error: "Unauthorized access. Please log in to continue." });
  }
}

module.exports = {
  checkNotLoggedIn,
  checkLoggedIn,
};
