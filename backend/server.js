require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mariadb = require('mariadb');
const childrenRoutes = require('./routes/children');
const trainingsRoutes = require('./routes/trainings');
const attendanceRoutes = require('./routes/attendance');
const exercisesRoutes = require('./routes/exercises');

BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  


//Initialiser l'application express
const app = express();

//Middleware

app.use(cors()); //Permet à l'API d'être accessible depuis n'importe quelle origine
app.use(express.json());//Permet de parser les requêtes de type application/json

// Logger la requête après le parsing JSON
app.use((req, res, next) => {
    console.log('Requête reçue :', req.method, req.url);
    console.log('Corps de la requête :', req.body);
    next();
  });
  

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

//Routes
app.use('/api/children', childrenRoutes);
app.use('/api/trainings', trainingsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exercises', exercisesRoutes);

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

