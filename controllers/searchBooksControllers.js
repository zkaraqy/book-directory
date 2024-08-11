const { getBooks, checkNextBooks, refactorDataProp } = require("../utils/book");
const { getUserLoginCache } = require("../utils/db");

const MAIN_LAYOUT = "layouts/main.ejs";

const renderSearchedBooks = async (req, res) => {
  const { q, startIndex } = req.query;
  const { items } = await getBooks(q, startIndex, 40);
  if (!items) {
    try {
      const dataUser =
        (await getUserLoginCache({
          username: req.session.username,
        })) ?? null;
      return res.render(MAIN_LAYOUT, {
        books: [],
        username: dataUser.username,
      });
    } catch (error) {
      return res.render(MAIN_LAYOUT, { books: [], username: null });
    }
  }
  const data = refactorDataProp(items);
  try {
    const dataUser =
      (await getUserLoginCache({
        username: req.session.username,
      })) ?? null;
    res.render(MAIN_LAYOUT, {
      books: data,
      username: dataUser.username,
      startIndex,
      q,
      pageNumber: parseInt(parseInt(startIndex) / 40 + 1),
      hasNext: await checkNextBooks(q, parseInt(startIndex) + 40, 40),
    });
  } catch (error) {
    res.render(MAIN_LAYOUT, {
      books: data,
      username: null,
      startIndex,
      q,
      pageNumber: parseInt(parseInt(startIndex) / 40 + 1),
      hasNext: await checkNextBooks(q, parseInt(startIndex) + 40, 40),
    });
  }
};

module.exports = renderSearchedBooks;
