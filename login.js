const URL = "http://127.0.0.1:8000";

const login = async () => {
    const login = document.getElementById("login-auth").value;
    const password = document.getElementById("password-auth").value;
    const statusElement = document.getElementById("login-message");
    const loginForm = document.querySelector(".login-form"); // Блок формы

    if (!login || !password) {
        statusElement.style.display = "block";
        statusElement.style.color = "red";
        statusElement.innerHTML = "Ошибка входа. Заполните все поля.";
        return;
    }

    try {
        const response = await fetch(`${URL}/login/${login}/${password}`);
        const data = await response.json();

        if (response.ok) {
            // Сохраняем токен и логин пользователя
            localStorage.setItem("authToken", data.token); // Используем токен с сервера
            localStorage.setItem("username", login); // Сохраняем логин пользователя
            
            statusElement.style.display = "block";
            statusElement.style.color = "green";
            statusElement.innerHTML = "Вы успешно авторизованы.";

            loginForm.style.display = "none"; // Скрываем форму входа

            // Обновляем интерфейс (если функция доступна)
            if (typeof updateAuthUI === "function") {
                updateAuthUI();
            }

            // Перенаправляем на страницу личного кабинета
            window.location.href = "lk.html";
        } else {
            statusElement.style.display = "block";
            statusElement.style.color = "red";
            statusElement.innerHTML = data.detail || "Неверный логин или пароль.";
        }
    } catch (error) {
        statusElement.style.display = "block";
        statusElement.style.color = "red";
        statusElement.innerHTML = "Ошибка сервера.";
    }
};