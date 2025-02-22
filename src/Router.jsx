import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import App from './App';
import Dashboard from './scenes/dashboard';
import Client from './scenes/Client/client';
import Vehicules from './scenes/Vehicules/Vehicules';
import Categorie from "./scenes/Categorie/categorie"
import Contrat from "./scenes/Contrat/Contrat"
import Login from './scenes/login/login';
import { useAuth } from './scenes/context/AuthContext';

const ProtectedLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Route accessible sans connexion */}
        <Route path="/login" element={<Login />} />

        {/* Routes protégées par connexion */}
        <Route
          path="/*"
          element={
            <ProtectedLayout>
              <App />
            </ProtectedLayout>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="client" element={<Client />} />
          <Route path="vehicules" element={<Vehicules />} />
          <Route path="Categorie" element={<Categorie />} />
          <Route path='Contrat' element={<Contrat/>}/>

        </Route>

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
