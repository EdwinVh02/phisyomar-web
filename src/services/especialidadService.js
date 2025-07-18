import api from './api';

// Obtener todas las especialidades
export const getEspecialidades = async () => {
  try {
    const response = await api.get('/especialidades');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener especialidades');
  }
};

// Obtener especialidad por ID
export const getEspecialidadById = async (id) => {
  try {
    const response = await api.get(`/especialidades/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener la especialidad');
  }
};

// Crear nueva especialidad (solo admin)
export const createEspecialidad = async (especialidadData) => {
  try {
    const response = await api.post('/especialidades', especialidadData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear especialidad');
  }
};

// Actualizar especialidad (solo admin)
export const updateEspecialidad = async (id, especialidadData) => {
  try {
    const response = await api.put(`/especialidades/${id}`, especialidadData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar especialidad');
  }
};

// Eliminar especialidad (solo admin)
export const deleteEspecialidad = async (id) => {
  try {
    const response = await api.delete(`/especialidades/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al eliminar especialidad');
  }
};