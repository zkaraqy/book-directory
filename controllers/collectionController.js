const { getUserLoginCache, deleteBookFromCollection } = require("../utils/db");
const { getItemsFromCollection } = require("../utils/book");

const COLLECTION_MAIN_LAYOUT = "collections/main-collection.ejs";

const renderCollectionView = async (req, res) => {
  const { username, nameCollection } = req.params;
  const dataUser =
    (await getUserLoginCache({
      username: req.session.username,
    })) ?? null;
  if (!dataUser) {
    console.log("You have not sign-up or log-in yet");
    return res.status(204).redirect("/");
  }
  if (dataUser.username !== username) {
    console.log("You dont have access to that");
    return res.status(204).redirect("/");
  }
  const items = await getItemsFromCollection(username, nameCollection);
  res.render(COLLECTION_MAIN_LAYOUT, {
    username,
    nameCollection,
    books: items,
  });
};

const deleteBook = async (req, res) => {
  const dataUser =
    (await getUserLoginCache({
      username: req.session.username,
    })) ?? null;
  if (!dataUser) {
    console.log("You have not sign-up or log-in yet");
    return res.status(204).end();
  }
  const { username, nameCollection, id } = req.params;
  if (dataUser.username !== username) {
    console.log("You dont have access to that");
    return res.status(204).end();
  }
  await deleteBookFromCollection(username, id, nameCollection)
    .then(() =>
      console.log("Successfully remove book from the personal collection")
    )
    .catch((err) => console.log(err));

  res.status(200).redirect(`/collection/${username}/${nameCollection}`);
};

module.exports = { renderCollectionView, deleteBook };
