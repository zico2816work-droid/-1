const express = require("express");
const path = require("path");
const {
  PUBLIC_DIR,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_MS
} = require("./src/config");
const { ensureDataFiles } = require("./src/dataStore");
const { createTestUser, loginWithPassword, findUserById } = require("./src/authService");
const {
  getSessionIdFromRequest,
  createSession,
  getSession,
  deleteSession
} = require("./src/sessionService");

const app = express();
const port = process.env.PORT || 3000;

ensureDataFiles();

app.use(express.json());

function readCurrentUser(req) {
  const sessionId = getSessionIdFromRequest(req);
  if (!sessionId) {
    return null;
  }

  const session = getSession(sessionId);
  if (!session) {
    return null;
  }

  const user = findUserById(session.userId);
  if (!user) {
    deleteSession(sessionId);
    return null;
  }

  return {
    sessionId,
    user
  };
}

function setSessionCookie(res, sessionId) {
  res.cookie(SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_MS,
    path: "/"
  });
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    path: "/"
  });
}

function requireApiAuth(req, res, next) {
  const auth = readCurrentUser(req);
  if (!auth) {
    return res.status(401).json({ message: "未登录" });
  }

  req.currentUser = auth.user;
  req.currentSessionId = auth.sessionId;
  return next();
}

function requirePageAuth(req, res, next) {
  const auth = readCurrentUser(req);
  if (!auth) {
    return res.redirect("/login");
  }

  return next();
}

function redirectIfLoggedIn(req, res, next) {
  const auth = readCurrentUser(req);
  if (auth) {
    return res.redirect("/dashboard");
  }

  return next();
}

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get(["/login", "/login.html"], redirectIfLoggedIn, (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "login.html"));
});

app.get(["/dashboard", "/dashboard/", "/dashboard.html"], requirePageAuth, (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "dashboard.html"));
});

app.use(express.static(PUBLIC_DIR));

app.post("/api/create-user", (req, res) => {
  const created = createTestUser();

  res.status(201).json({
    message: "测试账号已生成",
    user: {
      username: created.user.username,
      password: created.plainPassword
    }
  });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "请输入账号和密码" });
  }

  const user = loginWithPassword(String(username).trim(), String(password));
  if (!user) {
    return res.status(401).json({ message: "账号或密码错误" });
  }

  const sessionId = createSession(user.id);
  setSessionCookie(res, sessionId);

  return res.json({
    message: "登录成功",
    user: {
      username: user.username
    }
  });
});

app.get("/api/me", requireApiAuth, (req, res) => {
  res.json({
    user: {
      username: req.currentUser.username
    }
  });
});

app.post("/api/logout", (req, res) => {
  const sessionId = getSessionIdFromRequest(req);
  if (sessionId) {
    deleteSession(sessionId);
  }

  clearSessionCookie(res);
  res.json({ message: "退出成功" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
