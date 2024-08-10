const client = require("../config/database");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const PERSONAL_COLLECTIONS = "Personal collection";
const FAVORITES = "Favorites";

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("administrator").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.log(err);
  }
}

async function addUserLoginCache({ username }) {
  try {
    await client
      .db("user")
      .collection("users-login")
      .insertOne({ username, date: new Date().toUTCString() });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function getUserLoginCache({ username }) {
  try {
    const user = await client
      .db("user")
      .collection("users-login")
      .findOne({ username });
    return user;
  } catch (error) {
    throw new Error(error);
  }
}

async function addUser({ email, username, password }) {
  // console.log({ email, username, password });
  try {
    const hash = bcrypt.hashSync(password, salt);
    await client
      .db("user")
      .collection("email-username-password")
      .insertOne({ email, username, password: hash });
    return true;
  } catch (error) {
    throw new Error(error);
  }
}

async function getUser({ emailUsername, password }) {
  const tryEmail = await client
    .db("user")
    .collection("email-username-password")
    .findOne({ email: emailUsername })
    .then((val) => {
      if (!val) {
        return null;
      }
      const hash = val.password;
      if (bcrypt.compareSync(password, hash)) {
        return val;
      }
    })
    .catch((err) => console.log(err));
  if (tryEmail) {
    return tryEmail;
  }
  const tryUsername = await client
    .db("user")
    .collection("email-username-password")
    .findOne({ username: emailUsername })
    .then((val) => {
      if (!val) {
        return null;
      }
      const hash = val.password;
      if (bcrypt.compareSync(password, hash)) {
        return val;
      }
    })
    .catch((err) => console.log(err));
  if (tryUsername) {
    return tryUsername;
  }
  return null;
}

async function checkUser({ emailUsername }) {
  const checkEmail = await client
    .db("user")
    .collection("email-username-password")
    .findOne({ email: emailUsername })
    .then((val) => val)
    .catch((err) => console.log(err));
  if (checkEmail) {
    return checkEmail;
  }
  const checkUsername = await client
    .db("user")
    .collection("email-username-password")
    .findOne({ username: emailUsername })
    .then((val) => val)
    .catch((err) => console.log(err));
  if (checkUsername) {
    return checkUsername;
  }
  return null;
}

async function createUserCollection(username) {
  try {
    const userDB = client.db(username);
    await userDB.createCollection(PERSONAL_COLLECTIONS);
    await userDB.createCollection(FAVORITES);
    return true;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function addBookToPersonalCollections(username, book) {
  try {
    const userDB = client.db(username);
    await userDB.collection(PERSONAL_COLLECTIONS).insertOne(book);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function addBookToFavorites(username, book) {
  try {
    const userDB = client.db(username);
    await userDB.collection(FAVORITES).insertOne(book);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteBookFromCollection(username, id, nameCollection) {
  try {
    const userDB = client.db(username);
    await userDB.collection(nameCollection).deleteOne({ id });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  PERSONAL_COLLECTIONS,
  FAVORITES,
  run,
  addUser,
  getUser,
  checkUser,
  createUserCollection,
  addBookToPersonalCollections,
  addBookToFavorites,
  deleteBookFromCollection,
  addUserLoginCache,
  getUserLoginCache,
};
