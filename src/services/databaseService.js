import api from './api';

const DATABASE_ENDPOINTS = {
  stats: '/database/stats',
  backup: '/database/backup',
  backups: '/database/backups',
  optimize: '/database/optimize',
  tables: '/database/tables',
  connections: '/database/connections',
};

export const databaseService = {
  // Obtener estadísticas de la base de datos
  getStats: async () => {
    try {
      const response = await api.get(DATABASE_ENDPOINTS.stats);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de BD:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar estadísticas de BD'
      };
    }
  },

  // Obtener información de las tablas principales
  getTables: async () => {
    try {
      const response = await api.get(DATABASE_ENDPOINTS.tables);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener tablas:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar información de tablas'
      };
    }
  },

  // Obtener conexiones activas
  getConnections: async () => {
    try {
      const response = await api.get(DATABASE_ENDPOINTS.connections);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener conexiones:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar conexiones'
      };
    }
  },

  // Crear backup manual
  createBackup: async (descripcion = '') => {
    try {
      const response = await api.post(DATABASE_ENDPOINTS.backup, { 
        descripcion: descripcion || 'Backup manual creado desde panel de administración'
      });
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Backup creado exitosamente'
      };
    } catch (error) {
      console.error('Error al crear backup:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear backup'
      };
    }
  },

  // Obtener historial de backups
  getBackups: async () => {
    try {
      const response = await api.get(DATABASE_ENDPOINTS.backups);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener historial de backups:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar historial de backups'
      };
    }
  },

  // Descargar backup
  downloadBackup: async (backupId) => {
    try {
      const response = await api.get(`${DATABASE_ENDPOINTS.backups}/${backupId}/download`, {
        responseType: 'blob'
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al descargar backup:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al descargar backup'
      };
    }
  },

  // Restaurar backup
  restoreBackup: async (backupId) => {
    try {
      const response = await api.post(`${DATABASE_ENDPOINTS.backups}/${backupId}/restore`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Backup restaurado exitosamente'
      };
    } catch (error) {
      console.error('Error al restaurar backup:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al restaurar backup'
      };
    }
  },

  // Eliminar backup
  deleteBackup: async (backupId) => {
    try {
      await api.delete(`${DATABASE_ENDPOINTS.backups}/${backupId}`);
      return {
        success: true,
        message: 'Backup eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar backup:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar backup'
      };
    }
  },

  // Optimizar base de datos
  optimize: async () => {
    try {
      const response = await api.post(DATABASE_ENDPOINTS.optimize);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Base de datos optimizada exitosamente'
      };
    } catch (error) {
      console.error('Error al optimizar BD:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al optimizar base de datos'
      };
    }
  },

  // Verificar estado de salud de la base de datos
  healthCheck: async () => {
    try {
      const response = await api.get(`${DATABASE_ENDPOINTS.stats}/health`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error en health check:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error en verificación de salud'
      };
    }
  },

  // Obtener métricas de rendimiento
  getPerformanceMetrics: async () => {
    try {
      const response = await api.get(`${DATABASE_ENDPOINTS.stats}/performance`);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener métricas de rendimiento:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar métricas de rendimiento'
      };
    }
  },

  // Limpiar logs antiguos
  cleanLogs: async (dias = 30) => {
    try {
      const response = await api.post(`${DATABASE_ENDPOINTS.stats}/clean-logs`, { dias });
      return {
        success: true,
        data: response.data.data || response.data,
        message: `Logs anteriores a ${dias} días eliminados exitosamente`
      };
    } catch (error) {
      console.error('Error al limpiar logs:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al limpiar logs'
      };
    }
  }
};

export default databaseService;