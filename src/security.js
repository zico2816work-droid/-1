const crypto = require("crypto");

const PASSWORD_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";

function generateRandomString(length, chars) {
  const bytes = crypto.randomBytes(length);
  let result = "";

  for (let i = 0; i < length; i += 1) {
    result += chars[bytes[i] % chars.length];
  }

  return result;
}

function generatePassword(length = 8) {
  return generateRandomString(length, PASSWORD_CHARSET);
}

function generateUsername(existingUsernames) {
  let username = "";

  do {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    username = `demo${randomNumber}`;
  } while (existingUsernames.has(username));

  return username;
}

function createSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
}

function verifyPassword(password, salt, hashedPassword) {
  const candidate = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hashedPassword));
}

function generateSessionId() {
  return crypto.randomBytes(24).toString("hex");
}

module.exports = {
  generatePassword,
  generateUsername,
  createSalt,
  hashPassword,
  verifyPassword,
  generateSessionId
};
