import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useProfile from '../hooks/useProfile';
import LoadingSpinner from './LoadingSpinner';

const ProfileChecker = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isProfileComplete, isLoading, missingFields } = useProfile();

  const excludedPaths = [
    '/profile/complete',
    '/login',
    '/register',
    '/logout'
  ];

  useEffect(() => {
    // No verificar si estamos en rutas excluidas
    if (excludedPaths.some(path => location.pathname.includes(path))) {
      return;
    }

    // No verificar si no hay usuario o está cargando
    if (!user || isLoading) {
      return;
    }

    // Verificar si el perfil está incompleto
    if (!isProfileComplete) {
      console.log('Perfil incompleto detectado, redirigiendo...');
      navigate('/profile/complete', { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [user, isProfileComplete, isLoading, location.pathname, navigate]);

  // Mostrar spinner mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Si el perfil está incompleto y no estamos en una ruta excluida, no renderizar hijos
  if (!isProfileComplete && !excludedPaths.some(path => location.pathname.includes(path))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return children;
};

export default ProfileChecker;