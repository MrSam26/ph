document.addEventListener("DOMContentLoaded", function () {
    const authButtons = document.getElementById("auth-buttons");
    const userPanel = document.getElementById("user-panel");
    const logoutButton = document.getElementById("logout-btn");
    const userInfo = document.getElementById("user-info"); // Элемент для отображения информации о пользователе
    const userLoginElement = document.getElementById("user-login"); // Элемент для логина в личном кабинете
    const userRoleElement = document.getElementById("user-role"); // Элемент для роли в личном кабинете

    const URL = "http://127.0.0.1:8000"; // Убедитесь, что URL совпадает с вашим сервером

    // Функция для обновления интерфейса в зависимости от авторизации
    window.updateAuthUI = function () {
        const token = localStorage.getItem("authToken");
        const username = localStorage.getItem("username");

        if (token) {
            // Если пользователь авторизован
            if (authButtons) authButtons.style.display = "none";
            if (userPanel) userPanel.style.display = "flex";

            // Декодируем токен и обновляем информацию о пользователе
            try {
                const tokenParts = token.split('.');
                if (tokenParts.length !== 3) {
                    throw new Error("Неверный формат токена");
                }

                const payload = JSON.parse(atob(tokenParts[1]));
                if (userInfo) {
                    userInfo.textContent = `Логин: ${payload.sub}, Роль: ${payload.role}`;
                }

                // Если на странице есть элементы для личного кабинета, обновляем их
                if (userLoginElement) userLoginElement.textContent = payload.sub;
                if (userRoleElement) userRoleElement.textContent = payload.role;
            } catch (error) {
                console.error("Ошибка при разборе токена:", error);
                logout(); // Выход из системы при ошибке
            }

            // Скрываем форму входа/регистрации, если она есть
            const loginForm = document.querySelector(".login-form");
            if (loginForm) loginForm.style.display = "none";
        } else {
            // Если пользователь не авторизован
            if (authButtons) authButtons.style.display = "flex";
            if (userPanel) userPanel.style.display = "none";

            // Показываем форму входа/регистрации при выходе
            const loginForm = document.querySelector(".login-form");
            if (loginForm) loginForm.style.display = "block";

            // Очищаем информацию о пользователе
            if (userInfo) userInfo.textContent = "Пользователь не авторизован";
            if (userLoginElement) userLoginElement.textContent = "Загрузка...";
            if (userRoleElement) userRoleElement.textContent = "Загрузка...";
        }
    };

    // Функция для получения информации о пользователе с сервера
    const fetchUserInfo = async () => {
        const token = localStorage.getItem("authToken");
        const username = localStorage.getItem("username");

        if (!token || !username) {
            window.location.href = "login.html";
            return;
        }

        try {
            const response = await fetch(`${URL}/user/${username}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                if (userLoginElement) userLoginElement.textContent = userData.login;
                if (userRoleElement) userRoleElement.textContent = userData.role;
            } else {
                window.location.href = "login.html";
            }
        } catch (error) {
            console.error("Ошибка при получении данных пользователя:", error);
            window.location.href = "login.html";
        }
    };

    // Обработчик для кнопки выхода
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("authToken");
            localStorage.removeItem("username");
            updateAuthUI();
            window.location.href = "login.html"; // Перенаправляем на страницу входа
        });
    }

    // Обновляем интерфейс при загрузке страницы
    updateAuthUI();

    // Если на странице есть элементы для личного кабинета, загружаем информацию о пользователе
    if (userLoginElement && userRoleElement) {
        fetchUserInfo();
    }
});