import React from 'react';
import TrainingsList from './components/TrainingsList';
import TrainingDetails from './components/TrainingDetails';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<TrainingsList />} />
      <Route path="/trainings/:id" element={<TrainingDetails />} />
    </Routes>
  </Router>
  );
}

export default App;
