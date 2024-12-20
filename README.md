# README

## Projet Final : Application en Microservices avec Docker

<p align="center">
  <img src="assets/Logo-ESIEA.png" alt="ESIEA Logo" width="400" />
</p>

---

## Informations sur le Projet

- **Membres du groupe :**
  - BRASSÉ Nathan
  - VIDOUZE Paul
  - PHAM Nguyen Hoang Tung

- **Classe :** 4A FISA | TD 44 | TC 2  
- **Matière :** Conteneurisation
- **Professeur :** TAOUALIT Madjid

---


## Description
Ce projet est une application web composée de plusieurs microservices conteneurisés avec Docker. Elle s'inspire de l'application à Dockeriser du Lab6. Nous avons choisi de compléter cette application pour en faire un market place de jeux vidéos en ligne plus étoffé. Nous l'avons notamment doté d'une option de filtre selon le nom, le prix et le genre.

Elle comprend :

- **Backend** : Une API REST développée avec FastAPI pour gérer une base de données de jeux.
- **Base de données** : MySQL pour gérer les données.
- **Frontend** : Une interface utilisateur simple développée avec HTML, CSS et JavaScript.
- **Proxy** : Configuration Nginx pour servir le frontend et proxy les requêtes API.
- **Orchestration** : Tous les services sont orchestrés avec Docker Compose.

## Fonctionnalités
### Backend
- **POST** : Un bouton "add item" permet d'ajouter un jeu à la base de données avec : son nom, son prix, et son type.
- **GET** : Cela récupère la base de données de la liste des jeux.
- **DELETE** : Cela supprime un jeu de la base de données en utilisant son identifiant.
- **PUT** : Modifier les informations d'un jeu existant.
- **Connexion à une base de données** : Permet une connexion persistante avec notre base de données.

### Frontend
- Une interface utilisateur intuitive permettant :
  - L'ajout de données via un formulaire dynamique.
  - L'affichage des données récupérées depuis l'API avec une mise en page agréable pour l'utilisateur.
  - La suppression des données avec confirmation de l'utilisateur.
  - Une interface responsive pour une utilisation sur mobile et desktop.

### Proxy Nginx
- Servir les fichiers statiques du frontend.
- Rediriger les requêtes API vers le backend via un proxy.

## Structure du Projet
```plaintext
project/
│
├── backend/
│   ├── app/              # Code source du backend
│   │   └── main.py       # Point d'entrée de l'API
│   ├── Dockerfile.python # Conteneurisation du backend
│   └── requirements.txt  # Dépendances Python
│
├── frontend/
│   ├── src/              # Code source du frontend
│   │   ├── index.html    # Page HTML de l'application
│   │   ├── styles.css    # Feuilles de style CSS
│   │   ├── script.js     # Logique de l'application
│   │   ├── code.jquery.com_jquery-3.7.1.min.js  # Bibliothèque jQuery
│   │   └── jquery.form.js        # Gestion des formulaires avec jQuery
│   ├── nginx.conf        # Fichier de configuration du serveur nginx
│   └── Dockerfile.nginx  # Conteneurisation du frontend
│
├── database/
│   ├── init.sql          # Script d'initialisation de la base de données
│   └── Dockerfile.mysql  # Conteneurisation de la base de données
│
├── .env                  # Fichier des variables d'environnements
├── docker-compose.yml    # Orchestration des services
└── README.md             # Documentation du projet
```

## Prérequis
- **Docker** version 20.10 ou plus récent.
- **Docker Compose** version 1.29 ou plus récent.
- Navigateur web moderne (pour le frontend).

## Installation et Exécution
### Étapes pour exécuter le projet
1. Clonez ce dépôt :
   ```bash
   git clone <url-du-repo>
   cd project
   ```

2. Configurez les variables d'environnement :
   - Créez un fichier `.env` à la racine du projet avec le contenu suivant :
     ```env
     # MySQL Configuration
     MYSQL_ROOT_PASSWORD=root
     MYSQL_DATABASE=mydatabase
     MYSQL_USER=user
     MYSQL_PASSWORD=user

     # PhpMyAdmin Configuration
     PMA_HOST=database
     PMA_USER=user
     PMA_PASSWORD=user

     # Node.js API Configuration
     DB_HOST=database
     DB_USER=user
     DB_PASSWORD=user
     DB_NAME=mydatabase

     # React Front-End Configuration
     REACT_APP_BACKEND_URL=http://server:3000/
     ```

3. Construisez les images Docker :
   ```bash
   docker-compose build
   ```

4. Lancez l'application :
   ```bash
   docker-compose up
   ```

5. Accédez aux services :
   - **Frontend** : `http://localhost`.
   - **PhpMyAdmin** : `http://localhost:8080`.
   - **API** : `http://localhost/api` (les requêtes API sont servies par Nginx).

6. Nettoyez l'environnement après utilisation :
   ```bash
   docker-compose down
   ```

## Endpoints de l'API
Voici les endpoints disponibles dans le backend :

| Méthode | Endpoint          | Description                        |
|---------|-------------------|------------------------------------|
| POST    | `/register`       | Ajouter un nouveau jeu.            |
| GET     | `/games`          | Récupérer tous les jeux.           |
| PUT     | `/edit`           | Modifier un jeu existant.          |
| DELETE  | `/delete/{index}` | Supprimer un jeu par son identifiant.|

## Captures d'écran
### Frontend

### Backend (Utilisation avec curl)
```bash
# Ajouter un jeu
curl -X POST http://localhost/api/register -H "Content-Type: application/json" -d '{"name": "Chess", "cost": 20.5, "category": "Board Game"}'

# Récupérer tous les jeux
curl -X GET http://localhost/api/games

# Modifier un jeu
curl -X PUT http://localhost/api/edit -H "Content-Type: application/json" -d '{"id": 1, "name": "Checkers", "cost": 15.0, "category": "Board Game"}'

# Supprimer un jeu
curl -X DELETE http://localhost/api/delete/1
```
