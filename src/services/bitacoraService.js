import api from './api';

const BITACORA_ENDPOINTS = {
  getAll: '/bitacoras',
  show: (id) => `/bitacoras/${id}`,
  stats: '/bitacoras/estadisticas',
};

export const bitacoraService = {
  // Obtener todas las bitácoras
  getAll: async (params = {}) => {
    try {
      const response = await api.get(BITACORA_ENDPOINTS.getAll, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        meta: response.data.meta || {}
      };
    } catch (error) {
      console.error('Error al obtener bitácoras:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar bitácoras'
      };
    }
  },

  // Obtener bitácora por ID
  getById: async (id) => {
    try {
      const response = await api.get(BITACORA_ENDPOINTS.show(id));
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener bitácora:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar bitácora'
      };
    }
  },

  // Obtener estadísticas de bitácoras
  getStats: async (filters = {}) => {
    try {
      const bitacoras = await this.getAll(filters);
      if (!bitacoras.success) return bitacoras;

      const data = bitacoras.data || [];
      
      const errores = data.filter(b => b.nivel === 'ERROR');
      const warnings = data.filter(b => b.nivel === 'WARNING');
      const info = data.filter(b => b.nivel === 'INFO');
      
      const usuariosUnicos = [...new Set(data.map(b => b.usuario))].length;
      const hoy = new Date().toDateString();
      const eventosHoy = data.filter(b => 
        new Date(b.timestamp).toDateString() === hoy
      );
      const loginsHoy = data.filter(b => 
        b.tipo === 'LOGIN' && 
        new Date(b.timestamp).toDateString() === hoy
      );
      const usuariosActivosHoy = [...new Set(eventosHoy.map(b => b.usuario))].length;

      return {
        success: true,
        data: {
          total_registros: data.length,
          errores: errores.length,
          warnings: warnings.length,
          info: info.length,
          usuarios_unicos: usuariosUnicos,
          eventos_hoy: eventosHoy.length,
          logins_hoy: loginsHoy.length,
          usuarios_activos_hoy: usuariosActivosHoy,
          tipos_evento: this.getEventTypes(data)
        }
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        success: false,
        error: 'Error al calcular estadísticas'
      };
    }
  },

  // Obtener tipos de eventos y sus conteos
  getEventTypes: (data) => {
    const tipos = {};
    data.forEach(bitacora => {
      tipos[bitacora.tipo] = (tipos[bitacora.tipo] || 0) + 1;
    });
    return tipos;
  },

  // Filtrar por fecha
  getByDateRange: async (startDate, endDate, additionalFilters = {}) => {
    try {
      const params = {
        start_date: startDate,
        end_date: endDate,
        ...additionalFilters
      };
      return await this.getAll(params);
    } catch (error) {
      console.error('Error al filtrar por fecha:', error);
      return {
        success: false,
        error: 'Error al filtrar registros'
      };
    }
  },

  // Filtrar por usuario
  getByUser: async (usuario, additionalFilters = {}) => {
    try {
      const params = {
        usuario: usuario,
        ...additionalFilters
      };
      return await this.getAll(params);
    } catch (error) {
      console.error('Error al filtrar por usuario:', error);
      return {
        success: false,
        error: 'Error al filtrar registros'
      };
    }
  },

  // Filtrar por tipo de evento
  getByType: async (tipo, additionalFilters = {}) => {
    try {
      const params = {
        tipo: tipo,
        ...additionalFilters
      };
      return await this.getAll(params);
    } catch (error) {
      console.error('Error al filtrar por tipo:', error);
      return {
        success: false,
        error: 'Error al filtrar registros'
      };
    }
  },

  // Filtrar por nivel (ERROR, WARNING, INFO)
  getByLevel: async (nivel, additionalFilters = {}) => {
    try {
      const params = {
        nivel: nivel,
        ...additionalFilters
      };
      return await this.getAll(params);
    } catch (error) {
      console.error('Error al filtrar por nivel:', error);
      return {
        success: false,
        error: 'Error al filtrar registros'
      };
    }
  },

  // Exportar bitácoras
  exportar: async (filters = {}) => {
    try {
      const response = await api.get(`${BITACORA_ENDPOINTS.getAll}/export`, { 
        params: filters,
        responseType: 'blob'
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al exportar bitácoras:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al exportar datos'
      };
    }
  },

  // Limpiar bitácoras antiguas
  limpiar: async (dias = 30) => {
    try {
      const response = await api.post(`${BITACORA_ENDPOINTS.getAll}/cleanup`, { dias });
      return {
        success: true,
        data: response.data,
        message: `Bitácoras anteriores a ${dias} días eliminadas exitosamente`
      };
    } catch (error) {
      console.error('Error al limpiar bitácoras:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al limpiar bitácoras'
      };
    }
  }
};

export default bitacoraService;