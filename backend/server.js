require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mariadb = require('mariadb');


//Initialiser l'application express
const app = express();

//Middleware
app.use(cors()); //Permet à l'API d'être accessible depuis n'importe quelle origine
app.use(bodyParser.json()); //Permet de parser les requêtes de type application/json

//Connexion à la base de données
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

//Vérifier la connexion à la base de données
pool.getConnection()
    .then(conn => {
        console.log('Connecté à la base de données !');
        conn.release();
    })
    .catch(err => console.error('Erreur de connexion à la base de données :', err));


//Route par défaut
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'api Handball Tracker !' });
});

// Lancer le serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
} //Affiche un message dans la console

);

