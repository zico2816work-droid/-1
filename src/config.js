const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const DATA_DIR = path.join(ROOT_DIR, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SESSIONS_FILE = path.join(DATA_DIR, "sessions.json");

const SESSION_COOKIE_NAME = "demo_session";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24;

module.exports = {
  ROOT_DIR,
  PUBLIC_DIR,
  DATA_DIR,
  USERS_FILE,
  SESSIONS_FILE,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS
};
