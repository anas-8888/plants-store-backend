function isAdmin(req, res, next) {
      console.log(req.user);
      if (req.isAuthenticated() && req.user && req.user.is_admin) {
            return next();
      } else {
            return res.status(403).json({ error: "Access denied: Admins only." });
      }
}

module.exports = {
      isAdmin,
};
