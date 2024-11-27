import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Link } from 'react-router-dom';
const TrainingsList = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const response = await API.get('/trainings');
        setTrainings(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des entraînements:', err);
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  if (loading) {
    return <p>Chargement des entraînements...</p>;
  }

  return (
    <div className="p-4 bg-light min-h-screen">
    <h1 className="text-2xl font-bold mb-4 text-primary">Liste des Entraînements</h1>
    <ul className="space-y-4">
      {trainings.map((training) => (
        <li
          key={training.id}
          className="p-4 bg-white shadow-md rounded-lg border border-muted hover:bg-secondary hover:text-white transition duration-200"
        >
            <Link className="text-dark" to={`/trainings/${training.id}` }>
          {training.date } <br></br> {training.description}
            </Link>
        </li>
      ))}
    </ul>
  </div>
     
  );
};

export default TrainingsList;
