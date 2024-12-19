from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import mysql.connector
from mysql.connector import Error
from typing import List

app = FastAPI()

# Configuration CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

# Fonction pour établir une connexion à la base de données
def get_db_connection():
    """
    Initialise et retourne une connexion à la base de données MySQL.
    En cas d'échec, lève une exception HTTP.
    """
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

# Modèle Pydantic pour valider les données des requêtes
class Game(BaseModel):
    """
    Représente un jeu à enregistrer.
    """
    name: str 
    cost: float
    category: str

class GameUpdate(Game):
    """
    Modèle pour les mises à jour d'un jeu, incluant l'identifiant.
    """
    id: int

# Route pour enregistrer un nouveau jeu
@app.post("/register")
async def register_game(game: Game):
    """
    Enregistre un nouveau jeu dans la base de données.
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        # Requête SQL pour insérer un nouveau jeu
        sql = "INSERT INTO games (name, cost, category) VALUES (%s, %s, %s)"
        cursor.execute(sql, (game.name, game.cost, game.category))
        connection.commit()  # Confirmer les changements
        return {"message": "Game registered successfully"}
    except Error as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to register game")
    finally:
        cursor.close()
        connection.close()

# Route pour récupérer la liste des jeux
@app.get("/games")
async def get_games():
    """
    Récupère tous les jeux depuis la base de données.
    """
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)  # Retourner les résultats sous forme de dictionnaire
    try:
        # Requête SQL pour sélectionner tous les jeux
        sql = "SELECT * FROM games"
        cursor.execute(sql)
        result = cursor.fetchall()  # Récupérer tous les résultats
        return result
    except Error as e:
        print(e)
        raise HTTPException(status_code=500, detail="Failed to fetch games")
    finally:
        cursor.close()
        connection.close()

# Route pour modifier un jeu existant
@app.put("/edit")
async def edit_game(game: GameUpdate):
    """
    Met à jour les informations d'un jeu existant.
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        # Requête SQL pour mettre à jour un jeu
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

# Route pour supprimer un jeu
@app.delete("/delete/{index}")
async def delete_game(index: int):
    """
    Supprime un jeu de la base de données à partir de son identifiant.
    """
    connection = get_db_connection()
    cursor = connection.cursor()
    try:
        # Requête SQL pour supprimer un jeu
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
    # Lancer le serveur FastAPI avec Uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
