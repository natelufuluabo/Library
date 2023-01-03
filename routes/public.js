var express = require('express');
var router = express.Router();

// Require controller modules.
const { book_detail_public, book_list_public } = require("../controllers/bookController");
const { author_detail_public, author_list_public } = require("../controllers/authorController");
const { genre_detail_public, genre_list_public } = require("../controllers/genreController");

const { sign_up_get, sign_up_post, log_in_get, log_in_post, log_out } = require("../authentication/publicAuthController");

/// AUTH ROUTES ///

// GET request for creating admin
router.get("/sign-up", sign_up_get);

// POST request to create admin
router.post("/sign-up", sign_up_post);

// GET request for logging in admin
router.get("/log-in", log_in_get);

// POST request for loging in admin
router.post("/log-in", log_in_post);

// GET request for logging out admin
router.get("/log-out", log_out);

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render("index_public", {
    title: "Local Library Home",
    user: req.user
  })
});

/// BOOK ROUTES ///

// GET request for one Book.
router.get("/book/:id", book_detail_public);

// GET request for list of all Book items.
router.get("/books", book_list_public);

/// AUTHOR ROUTES ///

// GET request for one Author.
router.get("/author/:id", author_detail_public);

// GET request for list of all Authors.
router.get("/authors", author_list_public);

/// GENRE ROUTES ///

// GET request for one Genre.
router.get("/genre/:id", genre_detail_public);

// GET request for list of all Genre.
router.get("/genres", genre_list_public);

module.exports = router;