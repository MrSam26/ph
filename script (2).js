const API_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", function () {
    updateUserInfo(); // Проверяем авторизацию и обновляем интерфейс

    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    }
});

function updateUserInfo() {
    const token = localStorage.getItem("authToken");

    const loginButton = document.getElementById("open-login");
    const registerButton = document.getElementById("open-register");
    const profileLink = document.getElementById("profile-link");
    const logoutLink = document.getElementById("logout-link");
    const userInfo = document.getElementById("user-info");

    if (!token) {
        showLoggedOutUI();
        return;
    }

    try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            throw new Error("Неверный формат токена");
        }

        const payload = JSON.parse(atob(tokenParts[1]));

        if (!payload.sub || !payload.role) {
            throw new Error("Неверная структура payload");
        }

        // Если пользователь авторизован
        if (loginButton) loginButton.style.display = "none";
        if (registerButton) registerButton.style.display = "none";
        if (profileLink) profileLink.style.display = "inline-block";
        if (logoutLink) logoutLink.style.display = "inline-block";
        if (userInfo) userInfo.textContent = `Логин: ${payload.sub}, Роль: ${payload.role}`;

    } catch (error) {
        console.error("Ошибка при разборе токена:", error);
        logout();
    }
}

function showLoggedOutUI() {
    const loginButton = document.getElementById("open-login");
    const registerButton = document.getElementById("open-register");
    const profileLink = document.getElementById("profile-link");
    const logoutLink = document.getElementById("logout-link");
    const userInfo = document.getElementById("user-info");

    if (loginButton) loginButton.style.display = "inline-block";
    if (registerButton) registerButton.style.display = "inline-block";
    if (profileLink) profileLink.style.display = "none";
    if (logoutLink) logoutLink.style.display = "none";
    if (userInfo) userInfo.textContent = "Пользователь не авторизован";
}

function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    updateUserInfo();
    window.location.href = "login.html"; // Перенаправляем на страницу входа
}