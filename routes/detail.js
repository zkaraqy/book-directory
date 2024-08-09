const express = require("express");
const router = express.Router();
const getBookDetail = require("../controllers/detailBookController");

router.route("/:id").get(getBookDetail);

module.exports = router;
