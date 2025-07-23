import api from './api';

const CONFIGURACION_ENDPOINTS = {
  getAll: '/configuracion',
  update: '/configuracion',
  getByCategory: (category) => `/configuracion/${category}`,
  updateByCategory: (category) => `/configuracion/${category}`,
};

export const configuracionService = {
  // Obtener toda la configuración
  getAll: async () => {
    try {
      const response = await api.get(CONFIGURACION_ENDPOINTS.getAll);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener configuración:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar configuración'
      };
    }
  },

  // Obtener configuración por categoría
  getByCategory: async (category) => {
    try {
      const response = await api.get(CONFIGURACION_ENDPOINTS.getByCategory(category));
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error(`Error al obtener configuración de ${category}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || `Error al cargar configuración de ${category}`
      };
    }
  },

  // Actualizar toda la configuración
  updateAll: async (data) => {
    try {
      const response = await api.put(CONFIGURACION_ENDPOINTS.update, data);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Configuración actualizada exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar configuración:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar configuración'
      };
    }
  },

  // Actualizar configuración por categoría
  updateByCategory: async (category, data) => {
    try {
      const response = await api.put(CONFIGURACION_ENDPOINTS.updateByCategory(category), data);
      return {
        success: true,
        data: response.data.data || response.data,
        message: `Configuración de ${category} actualizada exitosamente`
      };
    } catch (error) {
      console.error(`Error al actualizar configuración de ${category}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || `Error al actualizar configuración de ${category}`
      };
    }
  },

  // Configuración General
  getGeneral: async () => {
    return await this.getByCategory('general');
  },

  updateGeneral: async (data) => {
    return await this.updateByCategory('general', data);
  },

  // Configuración de Notificaciones
  getNotificaciones: async () => {
    return await this.getByCategory('notificaciones');
  },

  updateNotificaciones: async (data) => {
    return await this.updateByCategory('notificaciones', data);
  },

  // Configuración de Seguridad
  getSeguridad: async () => {
    return await this.getByCategory('seguridad');
  },

  updateSeguridad: async (data) => {
    return await this.updateByCategory('seguridad', data);
  },

  // Configuración del Sistema
  getSistema: async () => {
    return await this.getByCategory('sistema');
  },

  updateSistema: async (data) => {
    return await this.updateByCategory('sistema', data);
  },

  // Resetear configuración a valores por defecto
  reset: async (category = null) => {
    try {
      const endpoint = category 
        ? `${CONFIGURACION_ENDPOINTS.getAll}/reset/${category}`
        : `${CONFIGURACION_ENDPOINTS.getAll}/reset`;
      
      const response = await api.post(endpoint);
      return {
        success: true,
        data: response.data.data || response.data,
        message: category 
          ? `Configuración de ${category} restablecida a valores por defecto`
          : 'Toda la configuración restablecida a valores por defecto'
      };
    } catch (error) {
      console.error('Error al resetear configuración:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al restablecer configuración'
      };
    }
  },

  // Exportar configuración
  exportar: async () => {
    try {
      const response = await api.get(`${CONFIGURACION_ENDPOINTS.getAll}/export`, {
        responseType: 'blob'
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al exportar configuración:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al exportar configuración'
      };
    }
  },

  // Importar configuración
  importar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('config_file', file);

      const response = await api.post(`${CONFIGURACION_ENDPOINTS.getAll}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Configuración importada exitosamente'
      };
    } catch (error) {
      console.error('Error al importar configuración:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al importar configuración'
      };
    }
  },

  // Validar configuración
  validate: async (data) => {
    try {
      const response = await api.post(`${CONFIGURACION_ENDPOINTS.getAll}/validate`, data);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al validar configuración:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al validar configuración'
      };
    }
  },

  // Obtener historial de cambios
  getHistory: async () => {
    try {
      const response = await api.get(`${CONFIGURACION_ENDPOINTS.getAll}/history`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener historial:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar historial de cambios'
      };
    }
  }
};

export default configuracionService;