import api from './api';

const RECEPCIONISTA_ENDPOINTS = {
  getAll: '/recepcionistas',
  create: '/recepcionistas',
  update: (id) => `/recepcionistas/${id}`,
  delete: (id) => `/recepcionistas/${id}`,
  show: (id) => `/recepcionistas/${id}`,
};

export const recepcionistaService = {
  // Obtener todas las recepcionistas
  getAll: async (params = {}) => {
    try {
      const response = await api.get(RECEPCIONISTA_ENDPOINTS.getAll, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        meta: response.data.meta || {}
      };
    } catch (error) {
      console.error('Error al obtener recepcionistas:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar recepcionistas'
      };
    }
  },

  // Crear nueva recepcionista
  create: async (data) => {
    try {
      const response = await api.post(RECEPCIONISTA_ENDPOINTS.create, data);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Recepcionista creada exitosamente'
      };
    } catch (error) {
      console.error('Error al crear recepcionista:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear recepcionista'
      };
    }
  },

  // Actualizar recepcionista
  update: async (id, data) => {
    try {
      const response = await api.put(RECEPCIONISTA_ENDPOINTS.update(id), data);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Recepcionista actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar recepcionista:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar recepcionista'
      };
    }
  },

  // Eliminar recepcionista
  delete: async (id) => {
    try {
      await api.delete(RECEPCIONISTA_ENDPOINTS.delete(id));
      return {
        success: true,
        message: 'Recepcionista eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar recepcionista:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar recepcionista'
      };
    }
  },

  // Obtener recepcionista por ID
  getById: async (id) => {
    try {
      const response = await api.get(RECEPCIONISTA_ENDPOINTS.show(id));
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener recepcionista:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar recepcionista'
      };
    }
  },

  // Obtener estadísticas de recepcionistas
  getStats: async () => {
    try {
      const recepcionistas = await this.getAll();
      if (!recepcionistas.success) return recepcionistas;

      const data = recepcionistas.data || [];
      return {
        success: true,
        data: {
          total: data.length,
          activos: data.filter(r => r.status === 'Activo').length,
          turno_matutino: data.filter(r => r.turno === 'Matutino').length,
          turno_vespertino: data.filter(r => r.turno === 'Vespertino').length
        }
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        success: false,
        error: 'Error al calcular estadísticas'
      };
    }
  }
};

// Exportaciones individuales para compatibilidad
export const getRecepcionistas = async () => {
  const result = await recepcionistaService.getAll();
  return result.success ? result.data : [];
};

export const createRecepcionista = async (data) => {
  const result = await recepcionistaService.create(data);
  if (!result.success) throw new Error(result.error);
  return result.data;
};

export const updateRecepcionista = async (id, data) => {
  const result = await recepcionistaService.update(id, data);
  if (!result.success) throw new Error(result.error);
  return result.data;
};

export const deleteRecepcionista = async (id) => {
  const result = await recepcionistaService.delete(id);
  if (!result.success) throw new Error(result.error);
  return result.message;
};

export default recepcionistaService;