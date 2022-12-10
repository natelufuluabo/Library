const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');
const Admin = require("../models/admins");

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, admin) => {
      if (err) { 
        return done(err);
      }
      if (!admin) {
        return done(null, false, { message: "Incorrect username" });
      }
      bcrypt.compare(password, admin.password, (err, res) => {
          if (res) {
            // passwords match! log user in
            return done(null, admin)
          } else {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" })
          }
      });
    });
  })
);

passport.serializeUser(function(admin, done) {
    done(null, admin.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, admin) {
      done(err, admin);
    });
});

// Display Admin sign up form on GET.
exports.sign_up_get = (req, res, next) => {
    res.render("admins_sign_up_form", { title : "Admin Sign Up" });
};

// Display Admin log in form on GET.
exports.log_in_get = (req, res, next) => {
    res.render("admins_log_in_form", { title : "Admin Log In" });
};