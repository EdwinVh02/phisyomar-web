import api from './api';

// Obtener todos los terapeutas
export const getTerapeutas = async () => {
  try {
    const response = await api.get('/terapeutas');
    return response.data;
  } catch (error) {
    // Si falla por autenticación, usar la ruta pública
    if (error.response?.status === 401) {
      try {
        const publicResponse = await api.get('/terapeutas-publico');
        return publicResponse.data;
      } catch (publicError) {
        throw new Error(publicError.response?.data?.message || 'Error al obtener terapeutas');
      }
    }
    throw new Error(error.response?.data?.message || 'Error al obtener terapeutas');
  }
};

// Obtener terapeutas para pacientes (ruta pública)
export const getTerapeutasPublico = async () => {
  try {
    console.log('Haciendo petición a: /terapeutas-publico');
    const response = await api.get('/terapeutas-publico');
    console.log('Respuesta recibida:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error completo en getTerapeutasPublico:', error);
    console.error('Error response:', error.response);
    console.error('Error message:', error.message);
    throw new Error(error.response?.data?.message || error.message || 'Error al obtener terapeutas disponibles');
  }
};

// Obtener terapeuta por ID
export const getTerapeutaById = async (id) => {
  try {
    const response = await api.get(`/terapeutas/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener el terapeuta');
  }
};

// Crear nuevo terapeuta
export const createTerapeuta = async (terapeutaData) => {
  try {
    const response = await api.post('/terapeutas', terapeutaData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear terapeuta');
  }
};

// Actualizar terapeuta
export const updateTerapeuta = async (id, terapeutaData) => {
  try {
    const response = await api.put(`/terapeutas/${id}`, terapeutaData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar terapeuta');
  }
};

// Eliminar terapeuta
export const deleteTerapeuta = async (id) => {
  try {
    const response = await api.delete(`/terapeutas/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al eliminar terapeuta');
  }
};

// Servicios específicos para terapeutas
export const getMisPacientes = async () => {
  try {
    const response = await api.get('/terapeuta/mis-pacientes');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener mis pacientes');
  }
};

export const getEstadisticasTerapeuta = async () => {
  try {
    const response = await api.get('/terapeuta/estadisticas');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener estadísticas');
  }
};