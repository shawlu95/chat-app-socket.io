// in-memory db
const users = [];

// user joins chat
function userJoins(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// get current user
function getUser(id) {
  return users.find((user) => user.id === id);
}

module.exports = { userJoins, getUser };
