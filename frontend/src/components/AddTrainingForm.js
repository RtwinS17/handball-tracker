import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const AddTrainingForm = () => {
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !description) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    try {
      await API.post('/trainings', { date, description });
      navigate('/'); // Redirige vers la liste des entraînements après l'ajout
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'entraînement:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div className="p-6 bg-light min-h-screen flex flex-col items-center">
      <h1 className="text-primary text-3xl font-bold mb-6">Ajouter un Entraînement</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-danger text-white rounded-lg">
          {error}
        </div>
      )}

      <form className="bg-white p-6 shadow-md rounded-lg w-full max-w-md" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-dark font-semibold mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-muted rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-dark font-semibold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-muted rounded-lg"
            placeholder="Description de l'entraînement"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-dark transition duration-200"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default AddTrainingForm;
