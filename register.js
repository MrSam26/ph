const URL = "http://127.0.0.1:8000";

const register = async () => {
    const login = document.getElementById("login-auth").value;
    const password = document.getElementById("password-auth").value;
    const role = document.getElementById("role-select").value;
    const statusElement = document.getElementById("register-message");
    const registerForm = document.querySelector(".login-form"); // Блок формы

    if (!login || !password || !role) {
        statusElement.style.display = "block";
        statusElement.style.color = "red";
        statusElement.innerHTML = "Ошибка регистрации. Заполните все поля.";
        return;
    }

    try {
        const response = await fetch(`${URL}/register/${login}/${password}/${role}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("authToken", data.token); // Сохраняем токен
            localStorage.setItem("username", login); // Сохраняем логин пользователя
            
            statusElement.style.display = "block";
            statusElement.style.color = "green";
            statusElement.innerHTML = "Вы успешно зарегистрированы.";

            registerForm.style.display = "none"; // Скрываем форму регистрации
            updateAuthUI(); // Обновляем кнопки
        } else {
            statusElement.style.display = "block";
            statusElement.style.color = "red";
            statusElement.innerHTML = data.info || "Ошибка регистрации.";
        }
    } catch (error) {
        statusElement.style.display = "block";
        statusElement.style.color = "red";
        statusElement.innerHTML = "Ошибка сервера.";
    }
};
