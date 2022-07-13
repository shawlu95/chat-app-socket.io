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

function userLeaves(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    // remove one and return the removed user
    return users.splice(id, 1)[0];
  }
}

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = { userJoins, getUser, userLeaves, getRoomUsers };
