const express = require("express");
const router = express.Router();
const {
  renderSignUpView,
  renderLoginView,
  signUp,
  login,
} = require("../controllers/authController");

router.route("/signUp.ejs").get(renderSignUpView).post(signUp);
router.route("/login.ejs").get(renderLoginView).post(login);

module.exports = router;
