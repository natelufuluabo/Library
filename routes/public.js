var express = require('express');
var router = express.Router();

// Require controller modules.
const { book_detail_public, book_list_public } = require("../controllers/bookController");
const { author_detail, author_list } = require("../controllers/authorController");
const { genre_detail, genre_list } = require("../controllers/genreController");

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render("index_public", {
    title: "Local Library Home"
  })
});

/// BOOK ROUTES ///

// GET request for one Book.
router.get("/book/:id", book_detail_public);

// GET request for list of all Book items.
router.get("/books", book_list_public);

module.exports = router;