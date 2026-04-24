import { apiGet, apiPost } from "./api.js";

const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const createUserBtn = document.getElementById("createUserBtn");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const accountPanel = document.getElementById("accountPanel");
const generatedUsername = document.getElementById("generatedUsername");
const generatedPassword = document.getElementById("generatedPassword");
const loginMessage = document.getElementById("loginMessage");

const LOGIN_IDLE_TEXT = "登 录";
const LOGIN_LOADING_TEXT = "登录中...";
const CREATE_USER_IDLE_TEXT = "生成测试账号";
const CREATE_USER_LOADING_TEXT = "生成中...";

function setMessage(text, type = "error") {
  if (!text) {
    loginMessage.textContent = "";
    loginMessage.classList.add("hidden");
    loginMessage.classList.remove("success");
    return;
  }

  loginMessage.textContent = text;
  loginMessage.classList.remove("hidden");
  if (type === "success") {
    loginMessage.classList.add("success");
  } else {
    loginMessage.classList.remove("success");
  }
}

function setLoginLoading(isLoading) {
  loginBtn.disabled = isLoading;
  usernameInput.disabled = isLoading;
  passwordInput.disabled = isLoading;
  loginBtn.textContent = isLoading ? LOGIN_LOADING_TEXT : LOGIN_IDLE_TEXT;
}

function setCreateUserLoading(isLoading) {
  createUserBtn.disabled = isLoading;
  createUserBtn.textContent = isLoading ? CREATE_USER_LOADING_TEXT : CREATE_USER_IDLE_TEXT;
}

async function checkAuthOnLoad() {
  try {
    await apiGet("/api/me");
    window.location.replace("/dashboard");
  } catch (error) {
    if (error.status !== 401) {
      setMessage(error.message || "加载失败，请稍后重试");
    }
  }
}

async function handleCreateUser() {
  setCreateUserLoading(true);
  setMessage("");

  try {
    const result = await apiPost("/api/create-user");
    const user = result?.user || {};
    generatedUsername.textContent = user.username || "-";
    generatedPassword.textContent = user.password || "-";
    accountPanel.classList.remove("hidden");

    usernameInput.value = user.username || "";
    passwordInput.value = user.password || "";
    setMessage("测试账号已生成，已自动填入输入框", "success");
  } catch (error) {
    setMessage(error.message || "生成账号失败");
  } finally {
    setCreateUserLoading(false);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  setMessage("");

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    setMessage("请输入账号和密码");
    return;
  }

  setLoginLoading(true);

  try {
    const result = await apiPost("/api/login", { username, password });
    const currentUsername = result?.user?.username;
    if (currentUsername) {
      sessionStorage.setItem("demo_username", currentUsername);
    }

    setMessage("登录成功，正在跳转...", "success");
    window.location.replace("/dashboard");
  } catch (error) {
    if (error.status === 401) {
      setMessage("账号或密码错误，请重试");
    } else if (error.status === 400) {
      setMessage("请输入账号和密码");
    } else {
      setMessage(error.message || "登录失败");
    }
  } finally {
    setLoginLoading(false);
  }
}

async function copyGeneratedValue(type) {
  const content = type === "username" ? generatedUsername.textContent : generatedPassword.textContent;
  if (!content || content === "-") {
    return;
  }

  try {
    await navigator.clipboard.writeText(content);
    setMessage(type === "username" ? "账号已复制" : "密码已复制", "success");
  } catch (error) {
    setMessage("复制失败，请手动复制");
  }
}

loginForm.addEventListener("submit", handleLogin);
createUserBtn.addEventListener("click", handleCreateUser);

accountPanel.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const copyType = target.dataset.copy;
  if (copyType === "username" || copyType === "password") {
    copyGeneratedValue(copyType);
  }
});

checkAuthOnLoad();
