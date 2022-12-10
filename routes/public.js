var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render("index_public", {
    title: "Local Library Home"
  })
});

module.exports = router;