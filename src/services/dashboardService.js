import api from './api';

export const dashboardService = {
  // Obtener estadísticas generales del dashboard
  getDashboardStats: async () => {
    try {
      const response = await api.get('/estadisticas/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener KPIs principales
  getKPIs: async (timeRange = 'month') => {
    try {
      const response = await api.get(`/estadisticas/kpis/${timeRange}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener métricas operativas
  getOperationalMetrics: async () => {
    try {
      const response = await api.get('/estadisticas/metricas-operativas');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener estadísticas del personal
  getPersonalStats: async () => {
    try {
      const response = await api.get('/estadisticas/personal');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener citas por mes
  getCitasPorMes: async (timeRange = '6months') => {
    try {
      const response = await api.get(`/estadisticas/citas-por-mes/${timeRange}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener actividad reciente (usando bitácoras)
  getRecentActivity: async (limit = 10) => {
    try {
      const response = await api.get(`/bitacoras?limit=${limit}&order=desc`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener resumen de citas de hoy
  getTodaysCitas: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get(`/citas?fecha=${today}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener estadísticas completas del dashboard
  getDashboardStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.warn('Error fetching dashboard stats:', error);
      throw error.response?.data || error;
    }
  },

  // Obtener conteos básicos para verificación
  getBasicCounts: async () => {
    try {
      const response = await api.get('/dashboard/counts');
      return response.data;
    } catch (error) {
      console.warn('Error fetching basic counts:', error);
      throw error.response?.data || error;
    }
  },

  // Obtener conteos rápidos para el dashboard (método legacy, ahora usa el endpoint específico)
  getQuickCounts: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      
      if (response.data.success) {
        const data = response.data.data;
        return {
          totalUsuarios: data.conteos.total_usuarios || 0,
          totalCitas: data.conteos.total_citas || 0,
          ingresosMes: data.conteos.ingresos_mes || 0,
          eficiencia: data.conteos.eficiencia || 0
        };
      }
      
      throw new Error('Respuesta inválida del servidor');
    } catch (error) {
      console.warn('Error fetching quick counts:', error);
      // Fallback: intentar obtener conteos básicos
      try {
        const basicResponse = await api.get('/dashboard/counts');
        if (basicResponse.data.success) {
          const data = basicResponse.data.data;
          return {
            totalUsuarios: data.usuarios || 0,
            totalCitas: data.citas || 0,
            ingresosMes: 0,
            eficiencia: 0
          };
        }
      } catch (fallbackError) {
        console.warn('Fallback también falló:', fallbackError);
      }
      
      // Si todo falla, devolver datos por defecto
      return {
        totalUsuarios: 0,
        totalCitas: 0,
        ingresosMes: 0,
        eficiencia: 0
      };
    }
  }
};

export default dashboardService;