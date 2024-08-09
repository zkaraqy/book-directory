const { getBook } = require("../utils/book");
const {
  getUserLoginCache,
  addBookToPersonalCollections,
  addBookToFavorites,
} = require("../utils/db");

const addToPersonalCollections = async (req, res) => {
  const dataUser =
    (await getUserLoginCache({
      username: req.session.username,
    })) ?? null;
  if (!dataUser) {
    console.log("You have not sign-up or log-in yet");
    return res
      .status(200)
      .json([{ status: 404, msg: "You have not sign-up or log-in yet" }])
      .end();
  }
  const { id } = req.params;
  const book = await getBook(id);
  await addBookToPersonalCollections(dataUser.username, book)
    .then(() => console.log("Successfully add book to the personal collection"))
    .catch((err) => {
      return res
        .status(200)
        .json([{ status: 404, msg: "Something went wrong" }])
        .end();
    });

  res
    .status(200)
    .json([{ status: 200, msg: "Successfully save book" }])
    .end();
};

const addToFavorites = async (req, res) => {
  const dataUser =
    (await getUserLoginCache({
      username: req.session.username,
    })) ?? null;
  if (!dataUser) {
    console.log("You have not sign-up or log-in yet");
    return res
      .status(200)
      .json([{ status: 404, msg: "You have not sign-up or log-in yet" }])
      .end();
  }
  const { id } = req.params;
  const book = await getBook(id);
  await addBookToFavorites(dataUser.username, book)
    .then(() => console.log("Successfully add book to the favorites"))
    .catch((err) => {
      return res
        .status(200)
        .json([{ status: 404, msg: "Something went wrong" }])
        .end();
    });

  res
    .status(200)
    .json([{ status: 200, msg: "Successfully save book" }])
    .end();
};

module.exports = { addToPersonalCollections, addToFavorites };
