const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("./UserModel"); // Import your external user model here

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = passport;
