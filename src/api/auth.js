import api from '../services/api';

// Iniciar sesión y obtener token
export async function loginUser(correoElectronico, contraseña) {
  try {
    console.log('🔐 Intentando login con:', { correo_electronico: correoElectronico });
    const response = await api.post('/login', {
      correo_electronico: correoElectronico,
      contraseña: contraseña,
    });

    const { usuario, token } = response.data;

    // Configurar token para próximas peticiones
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Obtener datos completos del usuario con información específica del rol
    const userDetailsResponse = await api.get('/user');
    const completeUserData = userDetailsResponse.data;

    // Guardar en localStorage los datos completos
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(completeUserData));

    console.log('✅ Login exitoso:', { usuario: completeUserData.user?.nombre, token: token.substring(0, 20) + '...' });
    return { usuario: completeUserData, token };
  } catch (error) {
    console.error('❌ Error en login:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Error al iniciar sesión');
  }
}

// Registrar nuevo usuario
export async function registerUser(userData) {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al registrar usuario');
  }
}

// Obtener usuario autenticado
export async function getAuthenticatedUser() {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al obtener el usuario');
  }
}

// Cerrar sesión
export async function logoutUser() {
  try {
    await api.post('/logout');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    // Limpiar localStorage independientemente del resultado
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}
