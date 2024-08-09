const session = require("express-session");

const sessionConfig = session({
  secret: "secret",
  resave: true,
  saveUninitialized: true,
  username: null,
  id: null,
});

module.exports = sessionConfig