const express = require("express");
const router = express.Router();
const {
  addToPersonalCollections,
  addToFavorites,
} = require("../controllers/bookController");

router.route("/addToPersonalCollections/:id").get(addToPersonalCollections);
router.route("/addToFavorites/:id").get(addToFavorites);

module.exports = router;
