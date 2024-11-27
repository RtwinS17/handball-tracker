# **Projet Handball Tracker**

## **1. Mise en place de l'environnement**

- **Installation de Docker** pour une gestion simplifiée des services.
- **Installation des dépendances :**
  - `Node.js` pour le back-end.
  - `MariaDB` pour la base de données.
  - `Express.js` pour gérer les routes API.
- **Création de la structure du projet :**
  - Dossier `backend` pour le code API.
  - Dossier `frontend` pour le code React.
  - Initialisation de Git pour la gestion des versions.

----------

## **2. Création de la base de données**

### **Tables créées :**

- **`children`** : Stocke les informations des enfants.
  - Champs : `id`, `first_name`, `last_name`, `birth_date`.
- **`trainings`** : Stocke les entraînements.
  - Champs : `id`, `date`, `description`.
- **`attendance`** : Gère la présence des enfants.
  - Champs : `id`, `training_id`, `child_id`, `present`.
- **`exercises`** : Gère les exercices liés aux entraînements.
  - Champs : `id`, `training_id`, `name`, `description`.

### **Commandes SQL principales :**

#### Exemple pour `trainings` :

`CREATE TABLE trainings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  description VARCHAR(255) NOT NULL
);`

## **3. Mise en place du Back-End**

### **Technologies utilisées :**

- **Node.js** avec **Express.js**.
- **MariaDB** pour la gestion des données.
- **CORS** pour permettre les requêtes depuis le front-end.
- Middleware `express.json()` pour parser les requêtes JSON.

### **Fichier `server.js` :**

    require('dotenv').config();
    const express = require('express');
    const mariadb = require('mariadb');
    const cors = require('cors');
    
    // Initialisation d'Express
    const app = express();
    app.use(cors());
    app.use(express.json());
    
    // Connexion à MariaDB
    const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,});
    
    // Test de connexion à la base
    pool.getConnection()
    .then(conn => {
    console.log('Connecté à la base de données !');
    conn.release();
    })
    .catch(err => console.error('Erreur de connexion :', err));
    // Routes
    const childrenRoutes = require('./routes/children');
    const trainingsRoutes = require('./routes/trainings');
    const attendanceRoutes = require('./routes/attendance');
    const exercisesRoutes = require('./routes/exercises');
    
    app.use('/api/children', childrenRoutes);
    app.use('/api/trainings', trainingsRoutes);
    app.use('/api/attendance', attendanceRoutes);
    app.use('/api/exercises', exercisesRoutes);
    
    // Lancement du serveur
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
    });

## **4. Routes API créées**

### **Routes pour `children` :**

- **GET `/api/children`** : Récupère tous les enfants.
- **POST `/api/children`** : Ajoute un nouvel enfant.
- **PUT `/api/children/:id`** : Modifie un enfant existant.
- **DELETE `/api/children/:id`** : Supprime un enfant.

### **Routes pour `trainings` :**

- **GET `/api/trainings`** : Récupère tous les entraînements.
- **POST `/api/trainings`** : Ajoute un entraînement.
- **PUT `/api/trainings/:id`** : Modifie un entraînement.
- **DELETE `/api/trainings/:id`** : Supprime un entraînement.
- **GET `/api/trainings/:id/details`** : Récupère les détails d’un entraînement (exercices et présences).

### **Routes pour `attendance` :**

- **GET `/api/attendance`** : Récupère toutes les présences.
- **POST `/api/attendance`** : Ajoute une nouvelle présence.
- **PUT `/api/attendance/:id`** : Modifie une présence existante.
- **DELETE `/api/attendance/:id`** : Supprime une présence.

### **Routes pour `exercises` :**

- **GET `/api/exercises`** : Récupère tous les exercices.
- **POST `/api/exercises`** : Ajoute un nouvel exercice.
- **PUT `/api/exercises/:id`** : Modifie un exercice existant.
- **DELETE `/api/exercises/:id`** : Supprime un exercice.
