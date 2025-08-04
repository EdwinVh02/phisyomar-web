import api from './api';

// Obtener todos los historiales médicos (para admin)
export const getHistoriales = async () => {
  try {
    const response = await api.get('/historiales');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener historiales');
  }
};

// Obtener historial médico del paciente logueado
export const getMiHistorialMedico = async () => {
  try {
    console.log('🔍 Obteniendo mi historial médico...');
    const response = await api.get('/paciente/mi-historial-medico');
    console.log('✅ Mi historial obtenido:', response.data);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('❌ Error al obtener mi historial:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener mi historial médico');
  }
};

// Obtener historial por ID
export const getHistorialById = async (id) => {
  try {
    const response = await api.get(`/historiales/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener el historial');
  }
};

// Crear nuevo historial médico
export const createHistorial = async (historialData) => {
  try {
    const response = await api.post('/historiales', historialData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear historial');
  }
};

// Actualizar historial médico
export const updateHistorial = async (id, historialData) => {
  try {
    const response = await api.put(`/historiales/${id}`, historialData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar historial');
  }
};

// Eliminar historial médico
export const deleteHistorial = async (id) => {
  try {
    const response = await api.delete(`/historiales/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al eliminar historial');
  }
};