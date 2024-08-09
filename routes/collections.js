const express = require("express");
const router = express.Router();
const {
  renderCollectionView,
  deleteBook,
} = require("../controllers/collectionController");

router.route("/:username/:nameCollection").get(renderCollectionView);
router.route("/:username/:nameCollection/delete/:id").delete(deleteBook);

module.exports = router;
