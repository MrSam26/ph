document.addEventListener("DOMContentLoaded", () => {
    const userLoginElement = document.getElementById("user-login");
    const userRoleElement = document.getElementById("user-role");
    const logoutButton = document.getElementById("logout-btn");

    const URL = "http://127.0.0.1:8000"; // Убедитесь, что URL совпадает с вашим сервером

    // Функция для выхода из системы
    const logout = () => {
        localStorage.removeItem("authToken"); // Удаляем токен
        localStorage.removeItem("username"); // Удаляем имя пользователя
        window.location.href = "login.html"; // Перенаправляем на страницу входа
    };

    // Функция для получения информации о пользователе
    const fetchUserInfo = async () => {
        const authToken = localStorage.getItem("authToken");
        const username = localStorage.getItem("username");

        if (!authToken || !username) {
            logout(); // Если токен или имя пользователя отсутствуют, выходим из системы
            return;
        }

        try {
            const response = await fetch(`${URL}/user/${username}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                if (userLoginElement) userLoginElement.textContent = userData.login;
                if (userRoleElement) userRoleElement.textContent = userData.role;
            } else {
                logout(); // Выход из системы при ошибке
            }
        } catch (error) {
            console.error("Ошибка при получении данных пользователя:", error);
            logout(); // Выход из системы при ошибке
        }
    };

    // Навешиваем обработчик выхода
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }

    // Загружаем информацию о пользователе при загрузке страницы
    fetchUserInfo();
});