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

// Récupérer toutes les présences (GET )
router.get('/', async (req,res) => {
    try{
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM attendance');
        conn.release();
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Ajouter une présence (POST)
router.post('/', async (req,res) => {
    const { training_id, child_id, present } = req.body;
    try {
        const conn = await pool.getConnection();
        const result = await conn.query('INSERT INTO attendance (training_id, child_id, present) VALUES (?, ?, ?)',
        [training_id, child_id, present]
    );
    conn.release();
    res.status(201).json({message: 'Présence ajoutée', id: result.insertID});
    } 
    catch (err){
        res.status(500).json({ error: err.message});
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
  
  //Supprimer une présence (DELETE)
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('DELETE FROM attendance WHERE id = ?', [id]);
      conn.release();
      if (result.affectedRows === 0) {
        res.status(404).json({ message: 'Présence non trouvée' });
      } else {
        res.json({ message: 'Présence supprimée' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  //Récupérer une présence par son ID 
  router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query('SELECT * FROM attendance WHERE id = ?', [id]);
        conn.release();
        if (rows.length) {
            res.json(rows[0]);
        }else {
            res.status(404).json({ error: 'Entrainement non trouvé'});
        }
    } catch (err) {
        res.status(500).json({ error: err.message});
    }    
  });

  // Récupérer toutes les présences pour un entraînement spécifique
router.get('/training/:training_id', async (req, res) => {
  const { training_id } = req.params;
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      `SELECT attendance.*, children.first_name, children.last_name 
       FROM attendance 
       JOIN children ON attendance.child_id = children.id 
       WHERE attendance.training_id = ?`,
      [training_id]
    );
    conn.release();
    if (rows.length === 0) {
      res.status(404).json({ message: 'Aucune présence trouvée pour cet entraînement' });
    } else {
      res.json(rows);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Supprimer une présence spécifique
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('DELETE FROM attendance WHERE id = ?', [id]);
    conn.release();
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Présence non trouvée' });
    } else {
      res.json({ message: 'Présence supprimée' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


  module.exports = router 
  
