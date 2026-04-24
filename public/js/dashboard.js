import { apiGet, apiPost } from "./api.js";

const welcomeText = document.getElementById("welcomeText");
const logoutButtons = [document.getElementById("logoutBtnTop"), document.getElementById("logoutBtnSidebar")];

function goToLogin() {
  window.location.replace("/login");
}

function setWelcomeUsername(username) {
  welcomeText.textContent = `欢迎你，${username || "-"}`;
}

async function loadCurrentUser() {
  const cachedUsername = sessionStorage.getItem("demo_username");
  if (cachedUsername) {
    setWelcomeUsername(cachedUsername);
  }

  try {
    const result = await apiGet("/api/me");
    const username = result?.user?.username || "-";
    sessionStorage.setItem("demo_username", username);
    setWelcomeUsername(username);
  } catch (error) {
    if (error.status === 401) {
      sessionStorage.removeItem("demo_username");
      goToLogin();
      return;
    }

    if (!cachedUsername) {
      welcomeText.textContent = "欢迎你，加载失败";
    }
  }
}

async function logout() {
  try {
    await apiPost("/api/logout");
  } catch (error) {
    // 无论后端响应如何，都尝试回到登录页以结束当前会话
  } finally {
    sessionStorage.removeItem("demo_username");
    goToLogin();
  }
}

logoutButtons.forEach((button) => {
  if (!button) {
    return;
  }

  button.addEventListener("click", logout);
});

loadCurrentUser();
