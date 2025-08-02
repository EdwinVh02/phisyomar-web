import api from './api';

// Obtener todas las citas
export const getCitas = async () => {
  try {
    const response = await api.get('/citas');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener citas');
  }
};

// Obtener cita por ID
export const getCitaById = async (id) => {
  try {
    const response = await api.get(`/citas/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener la cita');
  }
};

// Crear nueva cita
export const createCita = async (citaData) => {
  try {
    const response = await api.post('/citas', citaData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear cita');
  }
};

// Actualizar cita
export const updateCita = async (id, citaData) => {
  try {
    const response = await api.put(`/citas/${id}`, citaData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar cita');
  }
};

// Eliminar cita
export const deleteCita = async (id) => {
  try {
    const response = await api.delete(`/citas/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al eliminar cita');
  }
};

// Servicios específicos para pacientes
export const getMisCitas = async () => {
  try {
    console.log('🔍 Obteniendo mis citas...');
    
    // Verificar token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No hay token de autenticación');
    }
    
    const response = await api.get('/paciente/mis-citas');
    console.log('✅ Citas obtenidas:', response.data);
    
    // Asegurar que siempre retornamos un array
    const citas = response.data?.data || response.data || [];
    return Array.isArray(citas) ? citas : [];
    
  } catch (error) {
    console.error('❌ Error al obtener citas:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Tiempo de espera agotado. Verifica tu conexión a internet.');
    }
    
    if (error.response?.status === 404) {
      console.log('ℹ️ Endpoint no encontrado, retornando array vacío');
      return [];
    }
    
    if (error.response?.status === 401) {
      throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
    }
    
    const errorMessage = error.response?.data?.message || error.message || 'Error al obtener citas';
    console.error('❌ Error final:', errorMessage);
    throw new Error(errorMessage);
  }
};

export const agendarCita = async (citaData) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Enviando petición a /paciente/agendar-cita');
      console.log('📋 Datos enviados:', citaData);
    }
    
    const response = await api.post('/paciente/agendar-cita', citaData);
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Respuesta recibida:', response.data);
    }
    return response.data;
  } catch (error) {
    console.error('❌ Error en agendarCita:', error);
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
    }
    throw new Error(error.response?.data?.message || error.message || 'Error al agendar cita');
  }
};

export const cancelarCita = async (id) => {
  try {
    const response = await api.put(`/paciente/cancelar-cita/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al cancelar cita');
  }
};

// Obtener detalle completo de una cita
export const getCitaDetalle = async (id) => {
  try {
    const response = await api.get(`/paciente/cita/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener detalle de la cita');
  }
};

// Servicios específicos para terapeutas
export const getMisCitasTerapeuta = async () => {
  try {
    const response = await api.get('/terapeuta/mis-citas');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener mis citas como terapeuta');
  }
};