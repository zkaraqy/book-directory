const { getFullBook } = require("../utils/book");
const { getUserLoginCache } = require("../utils/db");

const BOOKS_DETAIL_LAYOUT = "books/bookDetail.ejs";

const getBookDetail = async (req, res) => {
  const { id } = req.params;
  const book = await getFullBook(id);
  const dataUser =
    (await getUserLoginCache({
      username: req.session.username,
    })) ?? null;
  res.render(BOOKS_DETAIL_LAYOUT, {
    book,
    username: dataUser ? dataUser.username : null,
  });
};

module.exports = getBookDetail;
