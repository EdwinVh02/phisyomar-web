import api from './api';

/**
 * Verificar el estado de completitud del perfil del usuario actual
 */
export async function checkProfileCompleteness() {
  try {
    const response = await api.get('/user/profile/check-completeness');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al verificar completitud del perfil');
  }
}

/**
 * Obtener los datos actuales del perfil específico del usuario
 */
export async function getProfileData() {
  try {
    const response = await api.get('/user/profile/data');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener datos del perfil');
  }
}

/**
 * Completar el perfil del usuario actual
 */
export async function completeProfile(profileData) {
  try {
    console.log('Enviando datos al backend:', profileData);
    const response = await api.post('/user/profile/complete', profileData);
    return response.data;
  } catch (error) {
    console.error('Error completo:', error);
    console.error('Error de respuesta:', error.response?.data);
    
    if (error.response?.data?.errors) {
      const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
      throw new Error(`Errores de validación: ${errorMessages}`);
    }
    
    throw new Error(error.response?.data?.message || 'Error al completar perfil');
  }
}

/**
 * Obtener información sobre qué campos faltan por completar
 */
export async function getMissingFields() {
  try {
    const response = await api.get('/user/profile/missing-fields');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener campos faltantes');
  }
}

/**
 * Actualizar un campo específico del perfil
 */
export async function updateProfileField(field, value) {
  try {
    const response = await api.patch('/user/profile/update-field', {
      field,
      value
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar campo del perfil');
  }
}