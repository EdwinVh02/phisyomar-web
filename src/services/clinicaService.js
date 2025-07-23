import api from './api';

const CLINICA_ENDPOINTS = {
  getAll: '/clinicas',
  create: '/clinicas',
  update: (id) => `/clinicas/${id}`,
  delete: (id) => `/clinicas/${id}`,
  show: (id) => `/clinicas/${id}`,
};

export const clinicaService = {
  // Obtener todas las clínicas
  getAll: async (params = {}) => {
    try {
      const response = await api.get(CLINICA_ENDPOINTS.getAll, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        meta: response.data.meta || {}
      };
    } catch (error) {
      console.error('Error al obtener clínicas:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar clínicas'
      };
    }
  },

  // Crear nueva clínica
  create: async (data) => {
    try {
      const response = await api.post(CLINICA_ENDPOINTS.create, data);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Clínica creada exitosamente'
      };
    } catch (error) {
      console.error('Error al crear clínica:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear clínica'
      };
    }
  },

  // Actualizar clínica
  update: async (id, data) => {
    try {
      const response = await api.put(CLINICA_ENDPOINTS.update(id), data);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Clínica actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar clínica:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar clínica'
      };
    }
  },

  // Eliminar clínica
  delete: async (id) => {
    try {
      await api.delete(CLINICA_ENDPOINTS.delete(id));
      return {
        success: true,
        message: 'Clínica eliminada exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar clínica:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar clínica'
      };
    }
  },

  // Obtener clínica por ID
  getById: async (id) => {
    try {
      const response = await api.get(CLINICA_ENDPOINTS.show(id));
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener clínica:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar clínica'
      };
    }
  },

  // Obtener estadísticas de clínicas
  getStats: async () => {
    try {
      const clinicas = await this.getAll();
      if (!clinicas.success) return clinicas;

      const data = clinicas.data || [];
      return {
        success: true,
        data: {
          total: data.length,
          activas: data.filter(c => c.status === 'Activo').length,
          capacidad_total: data.reduce((sum, clinica) => sum + (clinica.capacidad || 0), 0),
          en_mantenimiento: data.filter(c => c.status === 'Mantenimiento').length
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

export default clinicaService;