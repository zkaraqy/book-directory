function generateRandomId() {
  return "id-" + Date.now() + "-" + Math.floor(Math.random() * 10000);
}

function getUserFromSessionStorage() {
  return JSON.parse(sessionStorage.getItem("user"));
}

function createUserInSessionStorage(name) {
  return sessionStorage.setItem("user", JSON.stringify({ username: name }));
}

function getOrCreateUserInSessionStorage(name) {
  return getUserFromSessionStorage()
    ? getUserFromSessionStorage()
    : createUserInSessionStorage(name);
}

async function postUser({ username }) {
  try {
    const res = await fetch(`/users/add/${username}`, {
      method: "post",
    });
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  generateRandomId,
  getUserFromSessionStorage,
  createUserInSessionStorage,
  getOrCreateUserInSessionStorage,
  postUser,
};
