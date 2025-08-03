import { create } from 'zustand';

// Inicializar estado desde localStorage al crear el store
const initializeFromStorage = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      return {
        token,
        user: userData,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
      };
    } catch (error) {
      console.error('Error al parsear usuario desde localStorage:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    isInitialized: true,
  };
};

export const useAuthStore = create((set, get) => ({
  ...initializeFromStorage(),
  error: null,

  // Inicializar desde localStorage (ya no es necesario pero lo mantenemos por compatibilidad)
  initialize: () => {
    // Ya no hace nada porque el estado se inicializa automáticamente
  },

  // Login
  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    set({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
      isInitialized: true,
      error: null,
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true,
      error: null,
    });
  },

  // Set loading state
  setLoading: (isLoading) => set({ isLoading }),

  // Set error
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),

  // Verificar si el usuario tiene un rol específico
  hasRole: (roleId) => {
    const { user } = get();
    const userRoleId = user?.user?.rol_id || user?.rol_id;
    return userRoleId === roleId;
  },

  // Verificar si el usuario tiene uno de múltiples roles
  hasAnyRole: (roleIds) => {
    const { user } = get();
    const userRoleId = user?.user?.rol_id || user?.rol_id;
    return roleIds.includes(userRoleId);
  },

  // Actualizar datos del usuario (para cuando se completa el perfil)
  updateUser: (userData) => {
    const { user } = get();
    const updatedUser = { ...user, ...userData };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  // Verificar si el perfil está completo
  isProfileComplete: () => {
    const { user } = get();
    if (!user) return false;

    // Verificar según el rol
    switch (user.rol_id) {
      case 4: // Paciente
        const paciente = user.user?.paciente;
        return !!(
          paciente?.contacto_emergencia_nombre &&
          paciente?.contacto_emergencia_telefono &&
          paciente?.contacto_emergencia_parentesco
        );
      
      case 2: // Terapeuta
        const terapeuta = user.user?.terapeuta;
        return !!(
          terapeuta?.cedula_profesional &&
          terapeuta?.especialidad_principal &&
          terapeuta?.experiencia_anios
        );
      
      case 3: // Recepcionista
        return true; // Los recepcionistas no tienen campos obligatorios por ahora
      
      case 1: // Administrador
        return true; // Los administradores pueden funcionar sin campos específicos
      
      default:
        return false;
    }
  },

  // Obtener datos específicos del rol
  getRoleSpecificData: () => {
    const { user } = get();
    if (!user?.user) return null;

    switch (user.rol_id) {
      case 4: // Paciente
        return user.user.paciente;
      case 2: // Terapeuta
        return user.user.terapeuta;
      case 3: // Recepcionista
        return user.user.recepcionista;
      case 1: // Administrador
        return user.user.administrador;
      default:
        return null;
    }
  },

  // Obtener nombre del rol
  getRoleName: () => {
    const { user } = get();
    return user?.role_name || 'Desconocido';
  },
}));
