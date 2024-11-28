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
    <div className="p-4 bg-light min-h-screen flex flex-col">
    <h1 className="text-2xl font-bold m-4 text-primary ">Liste des Entraînements</h1>

    <div className="mb-4">
        <Link to="/add-training">
          <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-dark transition duration-200">
            Ajouter un Entraînement
          </button>
        </Link>
      </div>

      
    <ul className="flex flex-col space-y-6 ">
      {trainings.map((training)  => (
        <Link className="text-dark " to={`/trainings/${training.id}` }><li
          key={training.id}
          className="  p-4 bg-white shadow-md rounded-lg border  border-muted hover:bg-secondary hover:text-white transition duration-200"
        >  
          {training.date } <br></br> {training.description} 
        </li></Link>
      ))}
    </ul>
  </div>
     
  );
};

export default TrainingsList;
