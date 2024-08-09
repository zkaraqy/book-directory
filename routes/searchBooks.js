const express = require("express");
const router = express.Router();
const renderSearchedBooks = require("../controllers/searchBooksControllers");

router.route("/").get(renderSearchedBooks);

module.exports = router;
