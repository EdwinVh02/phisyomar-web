import api from './api';

// Obtener todos los pacientes
export const getPacientes = async () => {
  try {
    const response = await api.get('/pacientes');
    console.log('Respuesta del servidor:', response.data);
    // Verificar si la respuesta es un array directamente o está en data
    return Array.isArray(response.data) ? response.data : response.data.data;
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
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