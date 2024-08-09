const { addUserLoginCache } = require("../utils/db");

const addUserLoginCacheToDB = async (req, res) => {
  const { username } = req.params;
  await addUserLoginCache({ username });
  console.log({ username });
};

module.exports = addUserLoginCacheToDB;
