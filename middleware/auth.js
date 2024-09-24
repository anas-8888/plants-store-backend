const jwt = require("jsonwebtoken");

function checkNotLoggedIn(req, res, next) {
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    next();
  } else {
    return res.redirect("/");
  }
}

function checkLoggedIn(req, res, next) {
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.send("You are not login");
  }
  next();
}

module.exports = {
  checkNotLoggedIn,
  checkLoggedIn,
};
