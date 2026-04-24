const { SESSION_MAX_AGE_MS, SESSION_COOKIE_NAME } = require("./config");
const { readSessions, writeSessions } = require("./dataStore");
const { generateSessionId } = require("./security");

function parseCookies(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((result, chunk) => {
      const [key, ...rest] = chunk.split("=");
      if (!key || rest.length === 0) {
        return result;
      }

      result[key] = decodeURIComponent(rest.join("="));
      return result;
    }, {});
}

function getSessionIdFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[SESSION_COOKIE_NAME] || null;
}

function removeExpiredSessions() {
  const sessions = readSessions();
  const now = Date.now();
  let changed = false;

  Object.keys(sessions).forEach((sid) => {
    if (sessions[sid].expiresAt <= now) {
      delete sessions[sid];
      changed = true;
    }
  });

  if (changed) {
    writeSessions(sessions);
  }
}

function createSession(userId) {
  removeExpiredSessions();

  const sessions = readSessions();
  const sessionId = generateSessionId();
  const now = Date.now();

  sessions[sessionId] = {
    userId,
    createdAt: now,
    expiresAt: now + SESSION_MAX_AGE_MS
  };

  writeSessions(sessions);
  return sessionId;
}

function getSession(sessionId) {
  if (!sessionId) {
    return null;
  }

  removeExpiredSessions();
  const sessions = readSessions();
  return sessions[sessionId] || null;
}

function deleteSession(sessionId) {
  if (!sessionId) {
    return;
  }

  const sessions = readSessions();
  if (!sessions[sessionId]) {
    return;
  }

  delete sessions[sessionId];
  writeSessions(sessions);
}

module.exports = {
  getSessionIdFromRequest,
  createSession,
  getSession,
  deleteSession
};
