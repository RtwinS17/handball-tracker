const express = require('express');
const router = express.Router();
const mariadb = require('mariadb');
require('dotenv').config();

//Connexion à la base de données
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

//Récupérer tous les entraînements

router.get('/', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM trainings');
        conn.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Ajouter un entraînement
router.post('/', async (req, res) => {
    const { date, description } = req.body;
    try {
        const conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO trainings (date, description) VALUES (?, ?)', [date, description]);
        conn.release();
        res.status(201).json({ message: 'Entraînement ajouté !', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Modifier un entraînement
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { date, description } = req.body;
    try {
        const conn = await pool.getConnection();
        const result = await conn.query('UPDATE trainings SET date = ?, description = ? WHERE id = ?', [date, description, id]);
        conn.release();
        if (result.affectedRows) {
            res.json({ message: 'Entraînement mis à jour !' });
        } else {
            res.status(404).json({ error: 'Entraînement non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Supprimer un entraînement
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const conn = await pool.getConnection();
        const result = await conn.query('DELETE FROM trainings WHERE id = ?', [id]);
        conn.release();
        if (result.affectedRows) {
            res.json({ message: 'Entraînement supprimé !' });
        } else {
            res.status(404).json({ error: 'Entraînement non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Récupérer un entraînement par son id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM trainings WHERE id = ?', [id]);
        conn.release();
        if (rows.length) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: 'Entraînement non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Récupérer les détails complets d'un entraînement (exercices et présences)
router.get('/:id/details', async (req, res) => {
    const { id } = req.params;
    try {
      const conn = await pool.getConnection();
  
      // Récupérer les informations de l'entraînement
      const training = await conn.query('SELECT * FROM trainings WHERE id = ?', [id]);
  
      if (training.length === 0) {
        conn.release();
        return res.status(404).json({ message: 'Entraînement non trouvé' });
      }
  
      // Récupérer les exercices liés
      const exercises = await conn.query('SELECT * FROM exercises WHERE training_id = ?', [id]);
  
      // Récupérer les présences liées
      const attendance = await conn.query(
        `SELECT attendance.*, children.first_name, children.last_name 
         FROM attendance 
         JOIN children ON attendance.child_id = children.id 
         WHERE attendance.training_id = ?`,
        [id]
      );
  
      conn.release();
  
      // Envoyer toutes les informations
      res.json({
        training: training[0],
        exercises: exercises,
        attendance: attendance,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Mettre à jour une fiche d'entraînement (exercices et présences)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { training, exercises, attendance } = req.body;
  
    console.log('Body reçu :', req.body);
  
    const conn = await pool.getConnection(); // Récupère la connexion au début
  
    try {
      // Validation des champs d'entraînement
      if (training) {
        console.log('Données d\'entraînement :', training);
  console.log('Date :', training.date);
  console.log('Description :', training.description);
        if (!training.date || !training.description) {
          conn.release();
          return res.status(400).json({ message: 'Les champs "date" et "description" sont obligatoires.' });
        }
  
        // Mettre à jour les informations de l'entraînement
        await conn.query(
          'UPDATE trainings SET date = ?, description = ? WHERE id = ?',
          [training.date, training.description, id]
        );
      }
  
      // Mettre à jour les exercices
      if (exercises) {
        for (const exercise of exercises) {
          if (!exercise.name || !exercise.description) {
            conn.release();
            return res.status(400).json({ message: 'Les champs "name" et "description" sont obligatoires pour les exercices.' });
          }
          if (exercise.id) {
            // Modifier un exercice existant
            await conn.query(
              'UPDATE exercises SET name = ?, description = ? WHERE id = ?',
              [exercise.name, exercise.description, exercise.id]
            );
          } else {
            // Ajouter un nouvel exercice
            await conn.query(
              'INSERT INTO exercises (training_id, name, description) VALUES (?, ?, ?)',
              [id, exercise.name, exercise.description]
            );
          }
        }
      }
      
  
      // Mettre à jour les présences
      if (attendance) {
        for (const att of attendance) {
          if (!att.child_id || att.present === undefined) {
            conn.release();
            return res.status(400).json({ message: 'Les champs "child_id" et "present" sont obligatoires pour les présences.' });
          }
          if (att.id) {
            // Modifier une présence existante
            await conn.query(
              'UPDATE attendance SET child_id = ?, present = ? WHERE id = ?',
              [att.child_id, att.present, att.id]
            );
          } else {
            // Ajouter une nouvelle présence
            await conn.query(
              'INSERT INTO attendance (training_id, child_id, present) VALUES (?, ?, ?)',
              [id, att.child_id, att.present]
            );
          }
        }
      }
  
      // Si tout se passe bien, libère la connexion et renvoie le succès
      conn.release();
      res.json({ message: 'Fiche d\'entraînement mise à jour avec succès' });
  
    } catch (err) {
      // En cas d'erreur, libère la connexion et renvoie un message d'erreur
      conn.release();
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;