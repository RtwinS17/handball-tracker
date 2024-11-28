const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Récupérer tous les enfants
router.get('/', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM children');
      conn.release();
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Ajouter un enfant
router.post('/', async (req, res) => {
    const { first_name, last_name, birth_year } = req.body;
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO children (first_name, last_name, birth_year) VALUES (?, ?, ?)',
        [first_name, last_name, birth_year]
      );
      conn.release();
      res.status(201).json({ message: 'Enfant ajouté', id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Modifier un enfant
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, birth_year } = req.body;
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'UPDATE children SET first_name = ?, last_name = ?, birth_year = ? WHERE id = ?',
        [first_name, last_name, birth_year, id]
      );
      conn.release();
      if (result.affectedRows) {
        res.json({ message: 'Enfant mis à jour avec succès.' });
      } else {
        res.status(404).json({ error: 'Enfant non trouvé.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Supprimer un enfant
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('DELETE FROM children WHERE id = ?', [id]);
      conn.release();
      if (result.affectedRows) {
        res.json({ message: 'Enfant supprimé avec succès.' });
      } else {
        res.status(404).json({ error: 'Enfant non trouvé.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Récupérer un enfant par son ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM children WHERE id = ?', [id]);
      conn.release();
      if (rows.length) {
        res.json(rows[0]);
      } else {
        res.status(404).json({ error: 'Enfant non trouvé.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });



module.exports = router;
