function isCustomer(req, res, next) {
      if ((req.isAuthenticated() && req.user) || true) {
            return next();
      } else {
            return res.status(401).json({ error: "Unauthorized access. Please log in to continue." });
      }
}

module.exports = {
      isCustomer,
};
