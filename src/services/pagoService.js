import api from './api';

const PAGO_ENDPOINTS = {
  getAll: '/pagos',
  create: '/pagos',
  update: (id) => `/pagos/${id}`,
  delete: (id) => `/pagos/${id}`,
  show: (id) => `/pagos/${id}`,
  stats: '/pagos/estadisticas',
};

export const pagoService = {
  // Obtener todos los pagos
  getAll: async (params = {}) => {
    try {
      const response = await api.get(PAGO_ENDPOINTS.getAll, { params });
      return {
        success: true,
        data: response.data.data || response.data,
        meta: response.data.meta || {}
      };
    } catch (error) {
      console.error('Error al obtener pagos:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar pagos'
      };
    }
  },

  // Crear nuevo pago
  create: async (data) => {
    try {
      const response = await api.post(PAGO_ENDPOINTS.create, data);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Pago procesado exitosamente'
      };
    } catch (error) {
      console.error('Error al crear pago:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al procesar pago'
      };
    }
  },

  // Actualizar pago
  update: async (id, data) => {
    try {
      const response = await api.put(PAGO_ENDPOINTS.update(id), data);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Pago actualizado exitosamente'
      };
    } catch (error) {
      console.error('Error al actualizar pago:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar pago'
      };
    }
  },

  // Eliminar pago
  delete: async (id) => {
    try {
      await api.delete(PAGO_ENDPOINTS.delete(id));
      return {
        success: true,
        message: 'Pago eliminado exitosamente'
      };
    } catch (error) {
      console.error('Error al eliminar pago:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al eliminar pago'
      };
    }
  },

  // Obtener pago por ID
  getById: async (id) => {
    try {
      const response = await api.get(PAGO_ENDPOINTS.show(id));
      return {
        success: true,
        data: response.data.data || response.data
      };
    } catch (error) {
      console.error('Error al obtener pago:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al cargar pago'
      };
    }
  },

  // Obtener estadísticas de pagos
  getStats: async (filters = {}) => {
    try {
      const pagos = await this.getAll(filters);
      if (!pagos.success) return pagos;

      const data = pagos.data || [];
      
      const completados = data.filter(p => p.status === 'Completado');
      const pendientes = data.filter(p => p.status === 'Pendiente');
      const fallidos = data.filter(p => p.status === 'Fallido');
      
      const ingresos = completados.reduce((sum, pago) => sum + parseFloat(pago.monto || 0), 0);

      return {
        success: true,
        data: {
          total_pagos: data.length,
          completados: completados.length,
          pendientes: pendientes.length,
          fallidos: fallidos.length,
          ingresos_totales: ingresos,
          ingreso_promedio: completados.length > 0 ? ingresos / completados.length : 0
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

  // Exportar pagos
  exportar: async (filters = {}) => {
    try {
      const response = await api.get(`${PAGO_ENDPOINTS.getAll}/export`, { 
        params: filters,
        responseType: 'blob'
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error al exportar pagos:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al exportar datos'
      };
    }
  },

  // Procesar reembolso
  reembolsar: async (id, data = {}) => {
    try {
      const response = await api.post(`${PAGO_ENDPOINTS.show(id)}/refund`, data);
      return {
        success: true,
        data: response.data.data || response.data,
        message: 'Reembolso procesado exitosamente'
      };
    } catch (error) {
      console.error('Error al procesar reembolso:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error al procesar reembolso'
      };
    }
  }
};

export default pagoService;