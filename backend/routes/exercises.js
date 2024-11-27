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
    const { training_id, name, description } = req.body;
    try {
      const conn = await pool.getConnection();
      const result = await conn.query(
        'INSERT INTO exercises (training_id, name, description) VALUES (?, ?, ?)',
        [training_id, name, description]
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
  }
);

//Recupérer un exercice par son id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM exercises WHERE id = ?', [id]);
        conn.release();
        if (rows.length) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: 'Exercice non trouvé' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Récupérer tous les exercices pour un entraînement spécifique
router.get('/training/:training_id', async (req, res) => {
    const { training_id } = req.params;
    try {
      const conn = await pool.getConnection();
      const rows = await conn.query(
        'SELECT * FROM exercises WHERE training_id = ?',
        [training_id]
      );
      conn.release();
      if (rows.length === 0) {
        res.status(404).json({ message: 'Aucun exercice trouvé pour cet entraînement' });
      } else {
        res.json(rows);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Supprimer un exercice spécifique
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
  

module.exports = router;