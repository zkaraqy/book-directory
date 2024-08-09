const express = require("express");
const router = express.Router();
const addUserLoginCacheToDB = require("../controllers/usersController");

router.route("/add/:username").post(addUserLoginCacheToDB);

module.exports = router;
