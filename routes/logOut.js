const express = require("express");
const router = express.Router();
const logOut = require("../controllers/logoutController");

router.route("/").get(logOut);

module.exports = router;
