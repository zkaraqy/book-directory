const path = require("path");
const express = require("express");
const app = express();
const methodOverride = require("./config/methodOverrideConfig");
const session = require("./config/sessionConfig");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const logoutRoutes = require("./routes/logOut");
const searchBooksRoutes = require("./routes/searchBooks");
const bookRoutes = require("./routes/books");
const detailRoutes = require("./routes/detail");
const collectionRoutes = require("./routes/collections");
const { getUserLoginCache } = require("./utils/db");

require("./utils/invokeDB");

app.set("view engine", "ejs");

// Middleware
app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride);
app.use(session);

// Routes
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/logOut", logoutRoutes);
app.use("/searchBooks", searchBooksRoutes);
app.use("/book", bookRoutes);
app.use("/detail", detailRoutes);
app.use("/collection", collectionRoutes);

app.get("/", async (req, res) => {
  const MAIN_LAYOUT = "layouts/main.ejs";
  try {
    const data = await getUserLoginCache({
      username: req.session.username,
    });
    if (data == null) {
      res.status(200).render(MAIN_LAYOUT, { books: [], username: null });
    } else {
      const { username } = data;
      res.status(200).render(MAIN_LAYOUT, { books: [], username });
    }
  } catch (error) {
    console.log(error);
    res.status(200).render(MAIN_LAYOUT, { books: [], username: null });
  }
});

app.all("*", async (req, res) => {
  const ERROR_LAYOUT = "layouts/error.ejs";
  try {
    const data = await getUserLoginCache({
      username: req.session.username,
    });
    if (data == null) {
      res.status(200).render(ERROR_LAYOUT, { username: null });
    } else {
      const { username } = data;
      res.status(200).render(ERROR_LAYOUT, { username });
    }
  } catch (error) {
    console.log(error);
    res.status(200).render(ERROR_LAYOUT, { username: null });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
