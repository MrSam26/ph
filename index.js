document.addEventListener("DOMContentLoaded", () => {
    const authButtons = document.getElementById("auth-buttons"); // Контейнер для кнопок "Войти" и "Зарегистрироваться"
    const userPanel = document.getElementById("user-panel"); // Контейнер для кнопок "Личный кабинет" и "Выйти"
    const logoutButton = document.getElementById("logout-btn"); // Кнопка "Выйти"
    const userInfo = document.getElementById("user-info"); // Блок для информации о пользователе

    const URL = "http://127.0.0.1:8000"; // Адрес API

    // Функция для выхода из системы
    const logout = () => {
        localStorage.removeItem("authToken"); // Удаляем токен
        localStorage.removeItem("username"); // Удаляем имя пользователя
        window.location.href = "login.html"; // Перенаправляем на страницу входа
    };

    // Функция для обновления интерфейса
    const updateUI = () => {
        const token = localStorage.getItem("authToken");

        if (token) {
            // Если пользователь авторизован
            if (authButtons) authButtons.style.display = "none"; // Скрываем кнопки "Войти" и "Зарегистрироваться"
            if (userPanel) userPanel.style.display = "flex"; // Показываем кнопки "Личный кабинет" и "Выйти"

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
            } catch (error) {
                console.error("Ошибка при разборе токена:", error);
                logout(); // Выход из системы при ошибке
            }
        } else {
            // Если пользователь не авторизован
            if (authButtons) authButtons.style.display = "flex"; // Показываем кнопки "Войти" и "Зарегистрироваться"
            if (userPanel) userPanel.style.display = "none"; // Скрываем кнопки "Личный кабинет" и "Выйти"
            if (userInfo) userInfo.textContent = "Пользователь не авторизован"; // Обновляем информацию о пользователе
        }
    };

    // Навешиваем обработчик выхода
    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }

    // Обновляем интерфейс при загрузке страницы
    updateUI();
});