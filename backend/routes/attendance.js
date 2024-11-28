const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Récupérer toutes les présences
router.get('/', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM attendance');
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ajouter une présence
router.post('/', async (req, res) => {
  const { training_id, child_id, present } = req.body;
  if (!training_id || !child_id || present === undefined) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      'INSERT INTO attendance (training_id, child_id, present) VALUES (?, ?, ?)',
      [training_id, child_id, present]
    );
    conn.release();
    res.status(201).json({ message: 'Présence ajoutée.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Modifier une présence
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { training_id, child_id, present } = req.body;
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      'UPDATE attendance SET training_id = ?, child_id = ?, present = ? WHERE id = ?',
      [training_id, child_id, present, id]
    );
    conn.release();
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Présence non trouvée' });
    } else {
      res.json({ message: 'Présence mise à jour' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une présence
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('DELETE FROM attendance WHERE id = ?', [id]);
    conn.release();
    if (result.affectedRows) {
      res.json({ message: 'Présence supprimée' });
    } else {
      res.status(404).json({ message: 'Présence non trouvée' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les présences d’un enfant
router.get('/child/:child_id', async (req, res) => {
  const { child_id } = req.params;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM attendance WHERE child_id = ?', [child_id]);
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer les présences d’un entraînement
router.get('/training/:training_id', async (req, res) => {
  const { training_id } = req.params;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM attendance WHERE training_id = ?', [training_id]);
    conn.release();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
