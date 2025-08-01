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
    if (process.env.NODE_ENV === 'development') {
      console.log('Haciendo petición a: /terapeutas-publico');
    }
    const response = await api.get('/terapeutas-publico');
    if (process.env.NODE_ENV === 'development') {
      console.log('Respuesta recibida:', response.data);
    }
    return response.data;
  } catch (error) {
    console.error('Error completo en getTerapeutasPublico:', error);
    if (process.env.NODE_ENV === 'development') {
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
    }
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

// Servicios adicionales para dashboard avanzado
export const getPacienteDetalle = async (id) => {
  try {
    const response = await api.get(`/pacientes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener detalle del paciente');
  }
};

export const getCitaDetalle = async (id) => {
  try {
    const response = await api.get(`/citas/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener detalle de la cita');
  }
};

export const actualizarEstadoCita = async (id, estado, notas = '') => {
  try {
    const response = await api.put(`/citas/${id}`, { 
      estado,
      notas_terapeuta: notas
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar estado de la cita');
  }
};

export const crearNotaPaciente = async (pacienteId, nota) => {
  try {
    const response = await api.post(`/terapeuta/pacientes/${pacienteId}/notas`, {
      nota: nota
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear nota del paciente');
  }
};

// Servicios para historial médico
export const crearHistorialMedico = async (pacienteId, datosHistorial) => {
  try {
    const response = await api.post(`/terapeuta/pacientes/${pacienteId}/historial-medico`, datosHistorial);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear historial médico');
  }
};

export const agregarRegistroHistorial = async (pacienteId, registro) => {
  try {
    const response = await api.post(`/terapeuta/pacientes/${pacienteId}/registros`, registro);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al agregar registro al historial');
  }
};