from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from psycopg2 import connect, sql
from pydantic import BaseModel
from passlib.context import CryptContext

# Conexión a PostgreSQL
def get_db_connection():
    try:
        conn = connect(
            dbname="mi_api",
            user="postgres",
            password="admin",
            host="localhost",
            port="5432"
        )
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Could not connect to the database")

# Configuración de hashing de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Modelo para recibir datos de inicio de sesión
class UserLogin(BaseModel):
    username: str
    password: str

# Crear la instancia de la aplicación FastAPI
app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permitir todos los métodos
    allow_headers=["*"],  # Permitir todos los headers
)

# Ruta de login
@app.post("/login/")
def login(user: UserLogin):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(sql.SQL("SELECT password FROM users WHERE username = %s"), [user.username])
    result = cursor.fetchone()

    if not result or not verify_password(user.password, result[0]):
        raise HTTPException(status_code=400, detail="Username or password incorrect")

    cursor.close()
    conn.close()  # Asegúrate de cerrar la conexión después de usarla

    return {"message": "Login successful!"}

# Crear nuevo usuario (para pruebas)
@app.post("/register/")
def register(user: UserLogin):
    conn = get_db_connection()
    cursor = conn.cursor()

    hashed_password = get_password_hash(user.password)
    try:
        cursor.execute(
            sql.SQL("INSERT INTO users (username, password) VALUES (%s, %s)"),
            [user.username, hashed_password]
        )
        conn.commit()
    except Exception as e:
        conn.rollback()
        print(f"Error occurred: {e}")  # Imprimir el error
        raise HTTPException(status_code=400, detail="Username already exists")
    finally:
        cursor.close()
        conn.close()

    return {"message": "User registered successfully!"}
