import api from './api';

export const roleManagementService = {
  // Obtener todos los usuarios con sus roles
  getUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.rol_id) params.append('rol_id', filters.rol_id);
      if (filters.estatus) params.append('estatus', filters.estatus);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page);

      const response = await api.get(`/role-management/users?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener todos los roles disponibles
  getRoles: async () => {
    try {
      const response = await api.get('/role-management/roles');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cambiar el rol de un usuario
  changeUserRole: async (userId, roleData) => {
    try {
      const response = await api.put(`/role-management/users/${userId}/role`, roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Cambiar el estado de un usuario
  toggleUserStatus: async (userId, statusData) => {
    try {
      const response = await api.put(`/role-management/users/${userId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener estadísticas de usuarios por rol
  getUserStats: async () => {
    try {
      const response = await api.get('/role-management/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener historial de cambios de roles
  getRoleChangeHistory: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.usuario_id) params.append('usuario_id', filters.usuario_id);
      if (filters.page) params.append('page', filters.page);

      const response = await api.get(`/role-management/history?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default roleManagementService;