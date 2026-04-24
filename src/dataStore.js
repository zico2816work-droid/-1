const fs = require("fs");
const { DATA_DIR, USERS_FILE, SESSIONS_FILE } = require("./config");

function ensureJsonFile(filePath, defaultValue) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), "utf-8");
  }
}

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  ensureJsonFile(USERS_FILE, []);
  ensureJsonFile(SESSIONS_FILE, {});
}

function readJson(filePath, fallbackValue) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    return fallbackValue;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function readUsers() {
  return readJson(USERS_FILE, []);
}

function writeUsers(users) {
  writeJson(USERS_FILE, users);
}

function readSessions() {
  return readJson(SESSIONS_FILE, {});
}

function writeSessions(sessions) {
  writeJson(SESSIONS_FILE, sessions);
}

module.exports = {
  ensureDataFiles,
  readUsers,
  writeUsers,
  readSessions,
  writeSessions
};
