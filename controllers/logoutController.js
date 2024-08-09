const logOut = (req, res) => {
  req.session.username = null;
  res.status(204).redirect("/");
};

module.exports = logOut;
