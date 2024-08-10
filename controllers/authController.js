const {
  addUser,
  getUser,
  checkUser,
  createUserCollection,
  addUserLoginCache,
  getUserLoginCache,
} = require("../utils/db");
const validator = require('validator');

const AUTH_SIGNUP_VIEWS = "auth/signUp.ejs";
const AUTH_LOGIN_VIEWS = "auth/login.ejs";

const renderSignUpView = (req, res) => {
  res.render(AUTH_SIGNUP_VIEWS, { error: null });
};

const renderLoginView = (req, res) => {
  res.render(AUTH_LOGIN_VIEWS, { error: null });
};

const signUp = async (req, res) => {
  const { email, username, password } = req.body;
  if (!validator.isEmail(email)) {
    const error = "Please enter a valid email";
    return res.status(406).render(AUTH_SIGNUP_VIEWS, { error });
  }
  if (/^\d/.test(username)) {
    const error = "Username must not start with number";
    return res.status(406).render(AUTH_SIGNUP_VIEWS, { error });
  }
  // if (!validator.isStrongPassword(password)) {
  //   const error = "Please enter a strong password";
  //   return res.status(406).render(AUTH_SIGNUP_VIEWS, { error });
  // }
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
  const dataUser = await getUserLoginCache({
    username: req.session.username,
  });
  if (!!dataUser) {
    const error = "You already have an log-in";
    return res.status(406).render(AUTH_SIGNUP_VIEWS, { error });
  }
  try {
    console.log(dataUser);
    const tryAddUser = await addUser({ email, username, password });
    console.log("New user has been added: " + username);
    const tryCreateUserCollection = await createUserCollection(username);
    console.log("Database for: " + username + " successfully created");
    req.session.username = username;
  } catch (error) {
    console.log(error);
  }

  res.status(200).redirect("/");
};

const login = async (req, res) => {
  const dataUser = {};
  const { emailUsername, password } = req.body;
  const user = await getUser({ emailUsername, password });
  console.log(user);
  if (user) {
    dataUser.username = user.username;
    console.log("User: " + emailUsername + " is valid user. Welcome");
  } else {
    const error = "Email or username or password is wrong";
    return res.status(406).render(AUTH_LOGIN_VIEWS, { error });
  }
  console.log(user);
  req.session.username = user.username;
  addUserLoginCache({ username: emailUsername });

  res.status(200).redirect("/");
};

module.exports = {
  renderSignUpView,
  renderLoginView,
  signUp,
  login,
};
