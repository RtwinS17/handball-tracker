import React, { useState } from 'react';
import API from '../api/axios';

const AddExerciseModal = ({ trainingId, onClose }) => {
  const [newExercise, setNewExercise] = useState({ name: '', description: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description } = newExercise;

    if (!name || !description) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    try {
      await API.post(`/trainings/${trainingId}/exercises`, { name, description });
      onClose(); // Ferme la modale après succès
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'exercice :', err);
      setError('Une erreur est survenue.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-primary text-2xl font-bold mb-4">Ajouter un Exercice</h2>

        {error && <p className="text-danger mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-dark font-semibold mb-2">Nom de l'exercice</label>
            <input
              type="text"
              className="w-full p-2 border border-muted rounded-lg"
              value={newExercise.name}
              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-dark font-semibold mb-2">Description</label>
            <textarea
              className="w-full p-2 border border-muted rounded-lg"
              value={newExercise.description}
              onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-dark"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExerciseModal;
