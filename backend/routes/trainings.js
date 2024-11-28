const express = require('express');
const router = express.Router();
const pool = require('../config/db');


// Récupérer tous les entraînements
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

// Ajouter un entraînement
router.post('/', async (req, res) => {
  const { date, description} = req.body;
  if (!date || !description) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO trainings (date, description) VALUES (?, ?)',
      [date, description]
    );
    conn.release();
    res.status(201).json({ message: 'Entraînement ajouté.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modifier un entraînement
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { date, description } = req.body;
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE trainings SET date = ?, description = ? WHERE id = ?',
      [date, description, id]
    );
    conn.release();
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Entraînement non trouvé' });
    } else {
      res.json({ message: 'Entraînement mis à jour' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un entraînement
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('DELETE FROM trainings WHERE id = ?', [id]);
    conn.release();
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Entraînement non trouvé' });
    } else {
      res.json({ message: 'Entraînement supprimé' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer un entraînement par son ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM trainings WHERE id = ?', [id]); // Pas de déstructuration
    conn.release();
    if (rows.length > 0) { // Vérifie que la liste n'est pas vide
      res.json(rows[0]); // Retourne le premier élément
    } else {
      res.status(404).json({ error: 'Entraînement non trouvé' });
    }
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'entraînement :', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les détails d'un entraînement (exercices et présences)
router.get('/:id/details', async (req, res) => {
  const { id } = req.params;

  try {
    const conn = await pool.getConnection();

    // Récupérer les informations de l'entraînement
    const [training] = await conn.query('SELECT * FROM trainings WHERE id = ?', [id]);

    // Récupérer les exercices
    const exercises = await conn.query('SELECT * FROM exercises WHERE training_id = ?', [id]);

    // Récupérer les présences
    const attendance = await conn.query(
      'SELECT a.id, a.present, c.first_name, c.last_name FROM attendance a JOIN children c ON a.child_id = c.id WHERE a.training_id = ?',
      [id]
    );

    conn.release();
    res.json({ training, exercises, attendance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Mettre à jour une fiche d'entraînement (exercices et présences)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { training, exercises, attendance } = req.body;

  try {
    const conn = await pool.getConnection();

    // Mettre à jour les informations de l'entraînement
    if (training) {
      await conn.query(
        'UPDATE trainings SET date = ?, description = ? WHERE id = ?',
        [training.date, training.description, id]
      );
    }

    // Mettre à jour les exercices
    if (exercises) {
      for (const exercise of exercises) {
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

    conn.release();
    res.json({ message: 'Fiche d\'entraînement mise à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
