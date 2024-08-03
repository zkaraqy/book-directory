const path = require("path");
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const {
  addUser,
  getUser,
  checkUser,
  createUserCollection,
  addBookToPersonalCollections,
  addBookToFavorites,
  deleteBookFromCollection,
} = require("./utils/db");
const PORT = process.env.PORT || 5000;
const {
  getBooks,
  getBook,
  refactorDataProp,
  updateProgressPersonalCollection,
  updateProgressFavorites,
  getItemsFromCollection,
} = require("./utils/book");
const USER = { username: null };

require("./utils/invokeDB");

app.set("view engine", "ejs");
const MAIN_LAYOUT = "layouts/main.ejs";
const AUTH_SIGNUP_VIEWS = "auth/signUp.ejs";
const AUTH_LOGIN_VIEWS = "auth/login.ejs";

// Middleware
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      console.log(method, req.body._method);
      delete req.body._method;
      return method;
    }
  })
);

app.get("/", (req, res) => {
  res.status(200).render(MAIN_LAYOUT, { books: [], username: USER.username });
});

app.get("/info", (req, res) => {
  console.log(USER);
  res.status(204).end();
});

app.get("/auth/signUp.ejs", (req, res) => {
  res.render(AUTH_SIGNUP_VIEWS, { error: null, username: USER.username });
});

app.get("/auth/login.ejs", (req, res) => {
  res.render(AUTH_LOGIN_VIEWS, { error: null, username: USER.username });
});

app.post("/auth/signUp.ejs", async (req, res) => {
  if (USER.username) {
    const error = "You already have an log-in";
    return res.status(406).render(AUTH_SIGNUP_VIEWS, { error });
  }
  const { email, username, password } = req.body;
  const checkEmail = await checkUser({ emailUsername: email });
  if (checkEmail) {
    const error = "Email already used by someone";
    return res.status(406).render(AUTH_SIGNUP_VIEWS, { error });
  }
  const checkUsername = await checkUser({ emailUsername: username });
  if (checkUsername) {
    const error = "Username already used by someone";
    return res.status(406).render(AUTH_SIGNUP_VIEWS, { error });
  }
  try {
    const tryAddUser = await addUser({ email, username, password });
    console.log("New user has been added: " + username);
    const tryCreateUserCollection = await createUserCollection(username);
    console.log("Database for: " + username + " successfully created");
    USER.username = username;
  } catch (error) {
    console.log(error);
  }

  res.status(200).redirect("/");
});

app.post("/auth/login.ejs", async (req, res) => {
  if (USER.username) {
    const error = "You already have an log-in";
    return res.status(406).render(AUTH_LOGIN_VIEWS, { error });
  }
  const { emailUsername, password } = req.body;
  const user = await getUser({ emailUsername, password });
  if (user) {
    USER.username = user.username;
    console.log("User: " + emailUsername + " is valid user. Welcome");
  } else {
    const error = "Email/Username or password is wrong";
    return res.status(406).render(AUTH_LOGIN_VIEWS, { error });
  }
  console.log(user, USER);

  res.status(200).redirect("/");
});

app.get("/logOut", (req, res) => {
  USER.username = null;
  res.status(204).redirect("/");
});

app.get("/searchBooks", async (req, res) => {
  const { q } = req.query;
  try {
    const { items } = await getBooks(q, 0, 40);
    const data = refactorDataProp(items);
    res.render(MAIN_LAYOUT, { books: data, username: USER.username });
  } catch (error) {
    res.redirect("/");
  }
});

app.get("/getSingleBook/:id", async (req, res) => {
  const { id } = req.params;
  const book = await getBook(id);
  return res.json(book).end();
});

app.get("/:username/collection/:nameCollection", async (req, res) => {
  const { username, nameCollection } = req.params;
  if (!USER.username) {
    console.log("You have not sign-up or log-in yet");
    return res.status(204).end();
  }
  if (USER.username !== username) {
    console.log("You dont have access to that");
    return res.status(204).end();
  }
  const items = await getItemsFromCollection(username, nameCollection);
  // console.log({username, nameCollection, items});
  res.render("collections/main-collection.ejs", {
    username,
    nameCollection,
    books: items,
  });
});

app.get("/book/addToPersonalCollections/:id", async (req, res) => {
  if (!USER.username) {
    console.log("You have not sign-up or log-in yet");
    return res
      .status(200)
      .json([{ status: 404, msg: "You have not sign-up or log-in yet" }])
      .end();
  }
  const { id } = req.params;
  const book = await getBook(id);
  await addBookToPersonalCollections(USER.username, book)
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
});

app.get("/book/addToFavorites/:id", async (req, res) => {
  if (!USER.username) {
    console.log("You have not sign-up or log-in yet");
    return res
      .status(200)
      .json([{ status: 404, msg: "You have not sign-up or log-in yet" }])
      .end();
  }
  const { id } = req.params;
  const book = await getBook(id);
  await addBookToFavorites(USER.username, book)
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
});

app.get("/book/details/:id", async (req, res) => {
  const { id } = req.params;
  const book = await getBook(id);
  res.status(200).json(book).end();
});

app.put(
  "/:username/personal%20collection/updateProgress/:id",
  async (req, res) => {
    if (!USER.username) {
      console.log("You have not sign-up or log-in yet");

      return res.status(204).end();
    }
    const { username, id } = req.params;
    const { progress } = req.body;
    if (USER.username !== username) {
      console.log("You dont have access to that");
      return res.status(204).end();
    }
    await updateProgressPersonalCollection(username, id, progress)
      .then(() =>
        console.log(
          "Successfully update progress book in the personal collection"
        )
      )
      .catch((err) => console.log(err));

    res.status(204).end();
  }
);

app.put("/:username/favorites/updateProgress/:id", async (req, res) => {
  if (!USER.username) {
    console.log("You have not sign-up or log-in yet");
    return res.status(204).end();
  }
  const { username, id } = req.params;
  const { progress } = req.body;
  if (USER.username !== username) {
    console.log("You dont have access to that");
    return res.status(204).end();
  }
  await updateProgressFavorites(username, id, progress)
    .then(() =>
      console.log("Successfully update progress book in the favorites")
    )
    .catch((err) => console.log(err));

  res.status(204).end();
});

app.delete(`/:username/:nameCollection/delete/:id`, async (req, res) => {
  if (!USER.username) {
    console.log("You have not sign-up or log-in yet");
    return res.status(204).end();
  }
  const { username, nameCollection, id } = req.params;
  if (USER.username !== username) {
    console.log("You dont have access to that");
    return res.status(204).end();
  }
  await deleteBookFromCollection(username, id, nameCollection)
    .then(() =>
      console.log("Successfully remove book from the personal collection")
    )
    .catch((err) => console.log(err));

  res.status(200).redirect(`/${username}/collection/${nameCollection}`);
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
