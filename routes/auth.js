const express = require("express");
const passport = require("passport");
const { checkNotLoggedIn, checkLoggedIn } = require("./../middleware/auth");

const auth = express.Router();

// Auth with google
auth.get(
  "/providers/google",
  checkNotLoggedIn,
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

// Routing the google callback
auth.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    session: true,
  }),
  (req, res) => {
    res.redirect("https://nabtaty.com");
  }
);

// Auth logout
auth.get("/logout", checkLoggedIn, (req, res) => {
  req.session = null; // Destroys the session on the server
  res.clearCookie("session", { domain: ".nabtaty.com" });
  req.logout(); // Passport-specific logout
  res.status(200).json({ message: "Successfully logged out" });
});

module.exports = auth;
