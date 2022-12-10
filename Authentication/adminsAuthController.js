const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');
const Admin = require("../models/admins");
const { body, validationResult } = require("express-validator");

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

// Handle admin create on POST.
exports.sign_up_post = [
  // Validate and sanitize fields.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("email_address")
    .trim()
    .isEmail()
    .escape()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .isLength({ min : 8, max : 16 })
    .escape()
    .withMessage("Password must have at least 8 characters and a maximum of 16 characters")
    .matches('[0-9]').withMessage('Password must contain a number')
    .matches('[a-z]').withMessage('Password must contain an lowercase letter')
    .matches('[A-Z]').withMessage('Password must contain an uppercase letter'),
  
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("admins_sign_up_form", {
        title: "Admin Sign Up",
        admin: req.body,
        errors: errors.array(),
      });
      return;
    }
    // Data from form is valid.

    // Create an Author object with escaped and trimmed data.
    const admin = new Admin({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      email_address : req.body.email_address,
      password : req.body.password
    });
    admin.save((err) => {
      if (err) return next(err);
      // Successful - redirect to log in form.
      res.redirect("/admins/log-in");
    })
  }
];

// Display Admin log in form on GET.
exports.log_in_get = (req, res, next) => {
    res.render("admins_log_in_form", { title : "Admin Log In" });
};