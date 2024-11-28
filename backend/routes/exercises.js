const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Récupérer tous les exercices
router.get('/', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM exercises');
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ajouter un exercice
router.post('/', async (req, res) => {
  const { training_id, description, name } = req.body;
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO exercises (training_id, description, name) VALUES (?, ?, ?)',
      [training_id, description, name]
    );
    conn.release();
    res.status(201).json({ message: 'Exercice ajouté', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Modifier un exercice
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { training_id, name, description } = req.body;
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE exercises SET training_id = ?, name = ?, description = ? WHERE id = ?',
      [training_id, name, description, id]
    );
    conn.release();
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Exercice non trouvé' });
    } else {
      res.json({ message: 'Exercice mis à jour' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un exercice
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('DELETE FROM exercises WHERE id = ?', [id]);
    conn.release();
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Exercice non trouvé' });
    } else {
      res.json({ message: 'Exercice supprimé' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// récupérer les exercices d'un entraînement
router.get('/training/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM exercises WHERE training_id = ?', [id]);
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer un exercice par son ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM exercises WHERE id = ?', [id]);
    conn.release();
    if (rows.length) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'Exercice non trouvé' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
