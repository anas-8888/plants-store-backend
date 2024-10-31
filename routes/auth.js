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
  }),// TODO
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
  res.send("successful logout");
});

module.exports = auth;
