function generateRandomId() {
  return "id-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
}

function getUserFromSessionStorage() {
  return JSON.parse(sessionStorage.getItem("user"));
}

function createUserInSessionStorage(name, id) {
  return sessionStorage.setItem("user", JSON.stringify({ username: name, id }));
}

function getOrCreateUserInSessionStorage(name) {
  return getUserFromSessionStorage()
    ? getUserFromSessionStorage()
    : createUserInSessionStorage(name);
}

async function postUser(userData) {
  const res = await fetch(`/users/add/${userData.username}`, {
    method: "post",
    body: { id: userData.id },
  });
  console.log("Posted user:", res);
}

window.onload = async () => {
  const userData = getUserFromSessionStorage();
  if (!userData) {
    createUserInSessionStorage(null);
  }
  console.log(userData);
};

const profileButton = document.getElementById("profileButton");
const profileAction = document.getElementById("profileAction");
const usernameProfile = document.getElementById("usernameProfile");
const iconProfile = document.getElementById("iconProfile");

if (profileButton) {
  profileButton.addEventListener("click", function () {
    if (profileAction.classList.contains("hidden")) {
      profileAction.classList.remove("hidden");
      profileAction.classList.add("flex");
    } else {
      profileAction.classList.remove("flex");
      profileAction.classList.add("hidden");
    }
  });

  window.addEventListener("click", function (e) {
    if (e.target != profileAction && e.target != profileButton) {
      profileAction.classList.remove("flex");
      profileAction.classList.add("hidden");
    }
  });
}

const bttnAddBookToPersonalCollection = document.getElementsByClassName(
  "bttnAddBookToPersonalCollection"
);
const bttnAddBookToFavorites = document.querySelectorAll(
  ".bttnAddBookToFavorites"
);
const bttnDetailBook = document.querySelectorAll(".bttnDetailBook");
const toastContainer = document.getElementById("toastContainer");
const toastBookError = document.getElementById("toastBookError");
const pMessageError = document.getElementById("pMessageError");
const toastBookSuccess = document.getElementById("toastBookSuccess");
const pMessageSuccess = document.getElementById("pMessageSuccess");

for (let i = 0; i < bttnAddBookToPersonalCollection.length; i++) {
  bttnAddBookToPersonalCollection
    .item(i)
    .addEventListener("click", async function () {
      const id = bttnAddBookToPersonalCollection.item(i).value;
      const fetched = await fetch(`/book/addToPersonalCollections/${id}`).then(
        (data) => data.json()
      );
      const { status, msg } = fetched[0];
      if (status === 404) {
        const toast = createErrorToast(msg);
        toastContainer.appendChild(toast);
        setTimeout(() => {
          toastContainer.removeChild(toast);
        }, 3000);
      }
      if (status === 200) {
        const toast = createSuccessToast(msg);
        toastContainer.appendChild(toast);
        setTimeout(() => {
          toastContainer.removeChild(toast);
        }, 3000);
      }
    });
}

bttnAddBookToFavorites.forEach(function (bttn) {
  bttn.addEventListener("click", async function () {
    const id = bttn.value;
    const fetched = await fetch(`/book/addToFavorites/${id}`).then((data) =>
      data.json()
    );
    const { status, msg } = fetched[0];
    if (status === 404) {
      const toast = createErrorToast(msg);
      toastContainer.appendChild(toast);
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 3000);
    }
    if (status === 200) {
      const toast = createSuccessToast(msg);
      toastContainer.appendChild(toast);
      setTimeout(() => {
        toastContainer.removeChild(toast);
      }, 3000);
    }
  });
});

const signUpForm = document.getElementById("signUpForm");

if (signUpForm) {
  signUpForm.addEventListener("submit", async function () {
    const username = document.querySelector("#signUpForm #username").value;
    const id = generateRandomId();
    createUserInSessionStorage(username);
    await postUser({ username });
  });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function () {
    const username = document.querySelector("#loginForm #username").value;
    const id = generateRandomId();
    createUserInSessionStorage(username);
    await postUser({ username });
  });
}

const searchBttn = document.getElementById("searchBttn");
const loadingBook = document.getElementById("loading-book");
const booksContainer = document.getElementById("books-container");

if (searchBttn) {
  searchBttn.addEventListener("click", function () {
    loadingBook.classList.replace("hidden", "inline");
    booksContainer.addEventListener("load", function () {
      loadingBook.classList.replace("inline", "hidden");
    });
  });
}

function createErrorToast(message) {
  const elmt = document.createElement("div");
  elmt.setAttribute("id", "toastBookError");
  elmt.classList.add(
    ..."animate-slide-in alert alert-error bg-dark-theme-error/70 backdrop-blur-md".split(" ")
  );
  const icon = document.createElement("i");
  icon.classList.add(..."fa-solid fa-circle-exclamation".split(" "));
  const span = document.createElement("span");
  span.setAttribute("id", "pMessageSuccess");
  span.innerText = message;
  elmt.appendChild(icon);
  elmt.appendChild(span);
  return elmt;
}

function createSuccessToast(message) {
  const elmt = document.createElement("div");
  elmt.setAttribute("id", "toastBookSuccess");
  elmt.classList.add(
    ..."animate-slide-in alert alert-success bg-dark-theme-primary/60 backdrop-blur-md text-white".split(" ")
  );
  const icon = document.createElement("i");
  icon.classList.add(..."fa-solid fa-circle-check".split(" "));
  const span = document.createElement("span");
  span.setAttribute("id", "pMessageSuccess");
  span.innerText = message;
  elmt.appendChild(icon);
  elmt.appendChild(span);
  return elmt;
}
