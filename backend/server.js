require('dotenv').config();
const express = require('express');
const cors = require('cors');
const childrenRoutes = require('./routes/children');
const attendanceRoutes = require('./routes/attendance');
const exercisesRoutes = require('./routes/exercises');
const trainingsRoutes = require('./routes/trainings');

const app = express();

app.use(cors());
app.use(express.json());

BigInt.prototype.toJSON = function () {
    return this.toString();
  };

// Enregistrement des routes avec préfixes
app.use('/api/children', childrenRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exercises', exercisesRoutes);
app.use('/api/trainings', trainingsRoutes);

// Middleware pour afficher toutes les routes
app.get('/api/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Ajouter les méthodes HTTP et chemins
      const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
      routes.push({ methods, path: middleware.route.path });
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      // Gérer les sous-routeurs
      middleware.handle.stack.forEach((layer) => {
        if (layer.route) {
          const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
          routes.push({ methods, path: `${middleware.regexp.source.replace(/\\\//g, '/')}${layer.route.path}` });
        }
      });
    }
  });
  res.json(routes);
});

// Route par défaut
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Handball Tracker !' });
});

// Démarrer le serveur
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
