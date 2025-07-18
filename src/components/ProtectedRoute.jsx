import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // Mostrar loading solo si está explícitamente cargando
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.rol_id)) {
    // Redirigir a una página de acceso denegado o al dashboard
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}