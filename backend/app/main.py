from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import mysql.connector
from mysql.connector import Error
from typing import List

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection function
def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
        )
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

# Request models
class Game(BaseModel):
    name: str
    cost: float
    category: str

class GameUpdate(Game):
    id: int

# Routes
@app.post("/register")
async def register_game(game: Game):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        sql = "INSERT INTO games (name, cost, category) VALUES (%s, %s, %s)"
        cursor.execute(sql, (game.name, game.cost, game.category))
        connection.commit()
        return {"message": "Game registered successfully"}
    except Error as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to register game")
    finally:
        cursor.close()
        connection.close()

@app.get("/games")
async def get_games():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    try:
        sql = "SELECT * FROM games"
        cursor.execute(sql)
        result = cursor.fetchall()
        return result
    except Error as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to fetch games")
    finally:
        cursor.close()
        connection.close()

@app.put("/edit")
async def edit_game(game: GameUpdate):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        sql = "UPDATE games SET name = %s, cost = %s, category = %s WHERE idgames = %s"
        cursor.execute(sql, (game.name, game.cost, game.category, game.id))
        connection.commit()
        return {"message": "Game updated successfully"}
    except Error as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to update game")
    finally:
        cursor.close()
        connection.close()

@app.delete("/delete/{index}")
async def delete_game(index: int):
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        sql = "DELETE FROM games WHERE idgames = %s"
        cursor.execute(sql, (index,))
        connection.commit()
        return {"message": "Game deleted successfully"}
    except Error as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to delete game")
    finally:
        cursor.close()
        connection.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
