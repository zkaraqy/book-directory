const { getBooks, refactorDataProp } = require("../utils/book");
const { getUserLoginCache } = require("../utils/db");

const MAIN_LAYOUT = "layouts/main.ejs";

const renderSearchedBooks = async (req, res) => {
  const { q } = req.query;
  const { items } = await getBooks(q, 0, 40);
  if (!items) {
    try {
      const dataUser =
        (await getUserLoginCache({
          username: req.session.username,
        })) ?? null;
      return res.render(MAIN_LAYOUT, {
        books: null,
        username: dataUser.username,
      });
    } catch (error) {
      return res.render(MAIN_LAYOUT, { books: null, username: null });
    }
  }
  const data = refactorDataProp(items);
  try {
    const dataUser =
      (await getUserLoginCache({
        username: req.session.username,
      })) ?? null;
    res.render(MAIN_LAYOUT, { books: data, username: dataUser.username });
  } catch (error) {
    res.render(MAIN_LAYOUT, { books: data, username: null });
  }
};

module.exports = renderSearchedBooks;
