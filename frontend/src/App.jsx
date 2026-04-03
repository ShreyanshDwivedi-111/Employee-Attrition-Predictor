import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Insights from './pages/Insights';
import ModelInfo from './pages/ModelInfo';
import Predict from './pages/Predict';
import PredictionHistory from './pages/PredictionHistory';
import Performance from './pages/Performance';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="insights" element={<Insights />} />
            <Route path="model-info" element={<ModelInfo />} />
            <Route path="predict" element={<Predict />} />
            <Route path="history" element={<PredictionHistory />} />
            <Route path="performance" element={<Performance />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
