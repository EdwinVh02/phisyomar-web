import api from './api';

const ESTADISTICA_ENDPOINTS = {
  dashboard: '/estadisticas/dashboard',
  citas: '/estadisticas/citas',
  ingresos: '/estadisticas/ingresos',
  pacientes: '/estadisticas/pacientes',
  terapeutas: '/estadisticas/terapeutas',
  especialidades: '/estadisticas/especialidades',
  horarios: '/estadisticas/horarios-pico',
  kpis: '/estadisticas/kpis',
};

export const estadisticaService = {
  // Obtener estadísticas del dashboard principal
  getDashboard: async (params = {}) => {
    try {
      const response = await api.get(ESTADISTICA_ENDPOINTS.dashboard, { params });
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener estadísticas del dashboard:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar estadísticas'
      };
    }
  },

  // Obtener KPIs principales
  getKPIs: async (timeRange = 'month') => {
    try {
      const response = await api.get(ESTADISTICA_ENDPOINTS.kpis, { 
        params: { time_range: timeRange } 
      });
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener KPIs:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar KPIs'
      };
    }
  },

  // Obtener estadísticas de citas por período
  getCitasStats: async (timeRange = 'month', startDate = null, endDate = null) => {
    try {
      const params = { time_range: timeRange };
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await api.get(ESTADISTICA_ENDPOINTS.citas, { params });
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de citas:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar estadísticas de citas'
      };
    }
  },

  // Obtener estadísticas de ingresos
  getIngresosStats: async (timeRange = 'month', startDate = null, endDate = null) => {
    try {
      const params = { time_range: timeRange };
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const response = await api.get(ESTADISTICA_ENDPOINTS.ingresos, { params });
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de ingresos:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar estadísticas de ingresos'
      };
    }
  },

  // Obtener estadísticas de pacientes
  getPacientesStats: async (timeRange = 'month') => {
    try {
      const response = await api.get(ESTADISTICA_ENDPOINTS.pacientes, { 
        params: { time_range: timeRange } 
      });
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de pacientes:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar estadísticas de pacientes'
      };
    }
  },

  // Obtener estadísticas de terapeutas
  getTerapeutasStats: async () => {
    try {
      const response = await api.get(ESTADISTICA_ENDPOINTS.terapeutas);
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de terapeutas:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar estadísticas de terapeutas'
      };
    }
  },

  // Obtener estadísticas de especialidades más solicitadas
  getEspecialidadesStats: async (timeRange = 'month') => {
    try {
      const response = await api.get(ESTADISTICA_ENDPOINTS.especialidades, { 
        params: { time_range: timeRange } 
      });
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de especialidades:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar estadísticas de especialidades'
      };
    }
  },

  // Obtener horarios con más demanda
  getHorariosPico: async (timeRange = 'month') => {
    try {
      const response = await api.get(ESTADISTICA_ENDPOINTS.horarios, { 
        params: { time_range: timeRange } 
      });
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener horarios pico:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar horarios pico'
      };
    }
  },

  // Obtener todas las estadísticas necesarias para la página principal
  getAllStats: async (timeRange = 'month') => {
    try {
      const [kpis, citas, ingresos, especialidades, horarios] = await Promise.all([
        this.getKPIs(timeRange),
        this.getCitasStats(timeRange),
        this.getIngresosStats(timeRange),
        this.getEspecialidadesStats(timeRange),
        this.getHorariosPico(timeRange)
      ]);

      return {
        success: true,
        data: {
          kpis: kpis.success ? kpis.data : null,
          citas: citas.success ? citas.data : null,
          ingresos: ingresos.success ? ingresos.data : null,
          especialidades: especialidades.success ? especialidades.data : null,
          horarios: horarios.success ? horarios.data : null
        },
        errors: {
          kpis: !kpis.success ? kpis.error : null,
          citas: !citas.success ? citas.error : null,
          ingresos: !ingresos.success ? ingresos.error : null,
          especialidades: !especialidades.success ? especialidades.error : null,
          horarios: !horarios.success ? horarios.error : null
        }
      };
    } catch (error) {
      console.error('Error al obtener todas las estadísticas:', error);
      return {
        success: false,
        error: 'Error al cargar estadísticas completas'
      };
    }
  },

  // Exportar reporte de estadísticas
  exportarReporte: async (timeRange = 'month', formato = 'pdf') => {
    try {
      const response = await api.get(`${ESTADISTICA_ENDPOINTS.dashboard}/export`, { 
        params: { 
          time_range: timeRange,
          format: formato
        },
        responseType: 'blob'
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al exportar reporte:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al exportar reporte'
      };
    }
  }
};

export default estadisticaService;