import api from './api';

// Obtener todos los pacientes
export const getPacientes = async () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('📡 Enviando petición GET a /pacientes?all=true...');
    }
    const response = await api.get('/pacientes?all=true');
    if (process.env.NODE_ENV === 'development') {
      console.log('📨 Respuesta completa del servidor:', response);
      console.log('📊 Datos de la respuesta:', response.data);
      console.log('🔍 Status de la respuesta:', response.status);
    }
    
    // Para respuestas paginadas de Laravel, los datos están en response.data.data
    // Para respuestas directas, los datos están en response.data
    let data;
    
    if (Array.isArray(response.data)) {
      // Respuesta directa (array)
      data = response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      // Respuesta paginada de Laravel
      data = response.data.data;
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Estructura de respuesta inesperada:', response.data);
      }
      data = [];
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Datos procesados para retornar:', data);
      console.log('📋 Número de pacientes:', data.length);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error completo al obtener pacientes:', error);
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Respuesta del error:', error.response);
      console.error('❌ Estado del error:', error.response?.status);
      console.error('❌ Datos del error:', error.response?.data);
    }
    
    throw new Error(error.response?.data?.message || 'Error al obtener pacientes');
  }
};

// Obtener un paciente por ID
export const getPacienteById = async (id) => {
  try {
    const response = await api.get(`/pacientes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener el paciente');
  }
};

// Crear nuevo paciente
export const createPaciente = async (pacienteData) => {
  try {
    const response = await api.post('/pacientes', pacienteData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear paciente');
  }
};

// Actualizar paciente
export const updatePaciente = async (id, pacienteData) => {
  try {
    const response = await api.put(`/pacientes/${id}`, pacienteData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar paciente');
  }
};

// Eliminar paciente
export const deletePaciente = async (id) => {
  try {
    const response = await api.delete(`/pacientes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al eliminar paciente');
  }
};

// Obtener historial médico del paciente (para pacientes)
export const getMiHistorial = async () => {
  try {
    const response = await api.get('/paciente/mi-historial');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener el historial');
  }
};