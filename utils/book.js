const client = require("../config/database");
const { PERSONAL_COLLECTIONS, FAVORITES } = require("./db");

async function getBooks(q, startIndex, maxResults) {
  const URI = `https://www.googleapis.com/books/v1/volumes?q=${q}&startIndex=${startIndex}&maxResults=${maxResults}`;
  console.log(URI);
  try {
    const response = await fetch(URI)
      .then((data) => data)
      .catch((err) => console.log(err));
    const booksData = await response.json();
    return booksData;
  } catch (error) {
    console.log(error);
  }
}

async function getBook(id) {
  const URI = `https://www.googleapis.com/books/v1/volumes/${id}`;
  const date = new Date();
  const dateModified = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  try {
    const response = await fetch(URI)
      .then((data) => data)
      .catch((err) => console.log(err));
    const booksData = await response.json();
    const { volumeInfo } = booksData;
    const {
      title,
      subtitle,
      authors,
      publisher,
      publishedDate,
      pageCount,
      imageLinks,
      language,
    } = volumeInfo;
    return {
      id,
      volumeInfo: {
        title,
        subtitle,
        authors,
        publisher,
        publishedDate,
        pageCount,
        imageLinks,
        language,
      },
      dateModified,
      progress: "Pending",
    };
  } catch (error) {
    console.log(error);
  }
}

async function getFullBook(id) {
  const URI = `https://www.googleapis.com/books/v1/volumes/${id}`;
  try {
    const response = await fetch(URI);
    const bookData = await response.json();
    return bookData;
  } catch (error) {
    console.log(error);
  }
}

function refactorDataProp(items) {
  try {
    items = items.map((book) => {
      const {
        title,
        subtitle,
        authors,
        publisher,
        publishedDate,
        pageCount,
        imageLinks,
        language,
      } = book.volumeInfo;
      return {
        id: book.id,
        volumeInfo: {
          title,
          subtitle,
          authors,
          publisher,
          publishedDate,
          pageCount,
          imageLinks,
          language,
        },
        progress: "Pending",
      };
    });
    return items;
  } catch (error) {
    console.log(items);
    throw new Error(error);
  }
}

async function updateProgressPersonalCollection(username, id, value) {
  try {
    const userDB = client.db(username);
    await userDB.collection(PERSONAL_COLLECTIONS).updateOne(
      { id },
      {
        $set: {
          progress: value,
        },
      }
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function updateProgressFavorites(username, id, value) {
  try {
    const userDB = client.db(username);
    await userDB.collection(FAVORITES).updateOne(
      { id },
      {
        $set: {
          progress: value,
        },
      }
    );
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function getItemsFromCollection(username, nameCollection) {
  try {
    const userDB = client.db(username);
    const items = await userDB
      .collection(nameCollection)
      .find({})
      .toArray((err, res) => {
        if (err) {
          return console.log(err);
        }
        return res;
      });
    return items;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  getBooks,
  getBook,
  getFullBook,
  refactorDataProp,
  updateProgressPersonalCollection,
  updateProgressFavorites,
  getItemsFromCollection,
};
