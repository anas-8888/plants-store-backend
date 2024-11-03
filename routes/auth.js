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
    successRedirect: "/",
    session: true,
  })
);

// Auth logout
auth.get("/logout", checkLoggedIn, (req, res) => {
  req.logout();
  res.status(200).json({ message: "Successfully logged out" });
});

module.exports = auth;
