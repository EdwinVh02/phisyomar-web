import api from './api';

// Obtener todos los usuarios (solo admin)
export const getUsuarios = async () => {
  try {
    const response = await api.get('/usuarios');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
  }
};

// Obtener usuario por ID
export const getUsuarioById = async (id) => {
  try {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener el usuario');
  }
};

// Crear nuevo usuario (solo admin)
export const createUsuario = async (usuarioData) => {
  try {
    const response = await api.post('/usuarios', usuarioData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al crear usuario');
  }
};

// Registrar nuevo usuario público
export const registerUsuario = async (usuarioData) => {
  try {
    const response = await api.post('/register', usuarioData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al registrar usuario');
  }
};

// Actualizar usuario
export const updateUsuario = async (id, usuarioData) => {
  try {
    const response = await api.put(`/usuarios/${id}`, usuarioData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
  }
};

// Eliminar usuario (solo admin)
export const deleteUsuario = async (id) => {
  try {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
  }
};

// Actualizar perfil del usuario actual
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/user/profile', profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al actualizar perfil');
  }
};