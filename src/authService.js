const crypto = require("crypto");
const { readUsers, writeUsers } = require("./dataStore");
const {
  generatePassword,
  generateUsername,
  createSalt,
  hashPassword,
  verifyPassword
} = require("./security");

function toSafeUser(user) {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt
  };
}

function findUserById(userId) {
  const users = readUsers();
  return users.find((item) => item.id === userId) || null;
}

function findUserByUsername(username) {
  const users = readUsers();
  return users.find((item) => item.username === username) || null;
}

function createTestUser() {
  const users = readUsers();
  const existingUsernames = new Set(users.map((item) => item.username));
  const username = generateUsername(existingUsernames);
  const password = generatePassword(8);
  const salt = createSalt();
  const passwordHash = hashPassword(password, salt);

  const user = {
    id: crypto.randomUUID(),
    username,
    passwordSalt: salt,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  writeUsers(users);

  return {
    user: toSafeUser(user),
    plainPassword: password
  };
}

function loginWithPassword(username, password) {
  const user = findUserByUsername(username);
  if (!user) {
    return null;
  }

  const isValid = verifyPassword(password, user.passwordSalt, user.passwordHash);
  if (!isValid) {
    return null;
  }

  return toSafeUser(user);
}

module.exports = {
  createTestUser,
  loginWithPassword,
  findUserById
};
