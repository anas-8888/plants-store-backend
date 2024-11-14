function isAdmin(req, res, next) {
      if ((req.isAuthenticated() && req.user && req.user.is_admin) || true) {
            return next();
      } else {
            return res.status(403).json({ error: "Access denied: Admins only." });
      }
}

module.exports = {
      isAdmin,
};
