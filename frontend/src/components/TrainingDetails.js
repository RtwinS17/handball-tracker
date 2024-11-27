import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

const TrainingDetails = () => {
  const { id } = useParams();
  const [trainingDetails, setTrainingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await API.get(`/trainings/${id}/details`);
        setTrainingDetails(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des détails:', err);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) {
    return <p>Chargement des détails...</p>;
  }

  if (!trainingDetails) {
    return <p>Aucun détail trouvé.</p>;
  }

  const { training, exercises, attendance } = trainingDetails;

  return (
    <div>
      <h1>Détails de l'entraînement</h1>
      <p><strong>Date :</strong> {training.date}</p>
      <p><strong>Description :</strong> {training.description}</p>

      <h2>Exercices</h2>
      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            {exercise.name}: {exercise.description}
          </li>
        ))}
      </ul>

      <h2>Présences</h2>
      <ul>
        {attendance.map((att) => (
          <li key={att.id}>
            {att.first_name} {att.last_name} : {att.present ? 'Présent' : 'Absent'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrainingDetails;
