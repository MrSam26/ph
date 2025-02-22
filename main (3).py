from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import config

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Эндпоинт для получения информации о пользователе
@app.get("/user/{username}")
async def get_user_info(username: str, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Не авторизован")

    # Проверяем токен (в реальном приложении нужно валидировать токен)
    token = authorization.split("Bearer ")[1]

    # Подключаемся к базе данных
    conn = sqlite3.connect(config.db_name)
    cursor = conn.cursor()

    # Ищем пользователя в базе данных
    cursor.execute("SELECT login, role FROM users WHERE login=?", (username,))
    user_data = cursor.fetchone()

    if not user_data:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    cursor.close()
    conn.close()

    return {
        "login": user_data[0],
        "role": user_data[1]
    }

@app.get("/login/{user}/{password}")
async def login(user: str, password: str) -> dict:
    conn = sqlite3.connect(config.db_name)
    cursor = conn.cursor()
    cursor.execute("SELECT role FROM users WHERE login=? AND password=?", (user, password))
    picked_data = cursor.fetchone()

    if picked_data:
        role = picked_data[0]
        cursor.close()
        conn.close()
        return {
            "status": True,
            "code": 200,
            "role": role  # Возвращаем роль пользователя
        }

    cursor.close()
    conn.close()
    return {
        "status": False,
        "code": 404,
        "info": "No user in database"
    }

@app.post("/register/{user}/{password}/{role}")
async def register(user: str, password: str, role: str) -> dict:
    if role not in ["student", "teacher"]:
        raise HTTPException(status_code=400, detail="Invalid role. Choose 'student' or 'teacher'.")

    conn = sqlite3.connect(config.db_name)
    cursor = conn.cursor()
    cursor.execute("SELECT login FROM users WHERE login=?", (user,))
    
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return {
            "status": False,
            "code": 409,
            "info": "User already exists"
        }

    cursor.execute("INSERT INTO users (login, password, role) VALUES (?, ?, ?)", (user, password, role))
    conn.commit()
    cursor.close()
    conn.close()

    return {
        "status": True,
        "code": 200,
        "info": "User registered successfully"
    }
