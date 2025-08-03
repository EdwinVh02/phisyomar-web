import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import * as profileService from '../services/profileService';

export default function useProfile() {
  const { user, updateUser, isProfileComplete, getRoleSpecificData } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [missingFields, setMissingFields] = useState([]);

  // Verificar completitud del perfil al montar el componente
  useEffect(() => {
    if (user && !isProfileComplete()) {
      checkMissingFields();
    }
  }, [user]);

  const checkMissingFields = async () => {
    try {
      setIsLoading(true);
      const response = await profileService.getMissingFields();
      setMissingFields(response.data.missing_fields || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfile = async (profileData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await profileService.completeProfile(profileData);
      
      if (response.success) {
        // Actualizar los datos del usuario en el store
        updateUser(response.data);
        setMissingFields([]);
        return response;
      } else {
        throw new Error(response.message || 'Error al completar perfil');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileField = async (field, value) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await profileService.updateProfileField(field, value);
      
      if (response.success) {
        updateUser(response.data);
        return response;
      } else {
        throw new Error(response.message || 'Error al actualizar campo');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await profileService.getProfileData();
      updateUser(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // Estado
    isLoading,
    error,
    missingFields,
    
    // Datos
    user,
    roleSpecificData: getRoleSpecificData(),
    isProfileComplete: isProfileComplete(),
    
    // Acciones
    completeProfile,
    updateProfileField,
    refreshProfileData,
    checkMissingFields,
    
    // Utilidades
    clearError: () => setError(null),
  };
}