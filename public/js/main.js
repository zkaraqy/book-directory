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
      // console.log(fetched);
      const { status, msg } = fetched[0];
      if (status === 404) {
        toastBookError.classList.add("animate-shows");
        setTimeout(() => {
          toastBookError.classList.remove("animate-shows");
        }, 5000);
        pMessageError.innerText = msg;
      }
      if (status === 200) {
        toastBookSuccess.classList.add("animate-shows");
        setTimeout(() => {
          toastBookSuccess.classList.remove("animate-shows");
        }, 5000);
        pMessageSuccess.innerText = msg;
      }
    });
}

bttnAddBookToFavorites.forEach(function (bttn) {
  bttn.addEventListener("click", async function () {
    const id = bttn.value;
    const fetched = await fetch(`/book/addToFavorites/${id}`).then((data) =>
      data.json()
    );
    // console.log(fetched);
    const { status, msg } = fetched[0];
    if (status === 404) {
      toastBookError.classList.add("animate-shows");
      setTimeout(() => {
        toastBookError.classList.remove("animate-shows");
      }, 5000);
      pMessageError.innerText = msg;
    }
    if (status === 200) {
      toastBookSuccess.classList.add("animate-shows");
      setTimeout(() => {
        toastBookSuccess.classList.remove("animate-shows");
      }, 5000);
      pMessageSuccess.innerText = msg;
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

searchBttn.addEventListener("click", function () {
  loadingBook.classList.replace("hidden", "inline");
  booksContainer.addEventListener("load", function () {
    loadingBook.classList.replace("inline", "hidden");
  });
});
