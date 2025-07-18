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
    return user?.rol_id === roleId;
  },

  // Verificar si el usuario tiene uno de múltiples roles
  hasAnyRole: (roleIds) => {
    const { user } = get();
    return roleIds.includes(user?.rol_id);
  },
}));
