// Utilidad para probar la conectividad con el backend
import api from '../services/api';

export const testBackendConnection = async () => {
  try {
    console.log('🔄 Probando conexión con el backend...');
    
    // 1. Probar endpoint básico
    try {
      const response = await api.get('/prueba');
      console.log('✅ Conexión básica exitosa:', response.data);
    } catch (error) {
      console.log('❌ Error en conexión básica:', error.message);
    }

    // 2. Probar endpoint de usuarios (sin autenticación - debería fallar con 401)
    try {
      const response = await api.get('/usuarios');
      console.log('⚠️ Usuarios sin auth (no debería funcionar):', response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correcta protección de usuarios (401 Unauthorized)');
      } else {
        console.log('❌ Error inesperado en usuarios:', error.message);
      }
    }

    // 3. Probar endpoint de datos públicos
    try {
      const response = await api.get('/terapeutas-publico');
      console.log('✅ Datos públicos de terapeutas:', response.data);
    } catch (error) {
      console.log('❌ Error en datos públicos:', error.message);
    }

    // 4. Probar endpoint de especialidades
    try {
      const response = await api.get('/especialidades');
      console.log('✅ Especialidades públicas:', response.data);
    } catch (error) {
      console.log('❌ Error en especialidades:', error.message);
    }

    console.log('🏁 Pruebas de conectividad completadas');
    
  } catch (error) {
    console.error('❌ Error general en pruebas:', error);
  }
};

export const testAuthenticatedEndpoints = async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.log('⚠️ No hay token de autenticación para probar endpoints protegidos');
    return;
  }

  try {
    console.log('🔄 Probando endpoints autenticados...');

    // 1. Probar datos del usuario actual
    try {
      const response = await api.get('/user');
      console.log('✅ Datos del usuario actual:', response.data);
    } catch (error) {
      console.log('❌ Error al obtener usuario actual:', error.message);
    }

    // 2. Probar usuarios (admin)
    try {
      const response = await api.get('/usuarios');
      console.log('✅ Lista de usuarios (admin):', response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('⚠️ Sin permisos para ver usuarios (403 Forbidden) - Normal si no eres admin');
      } else {
        console.log('❌ Error inesperado en usuarios:', error.message);
      }
    }

    // 3. Probar pacientes
    try {
      const response = await api.get('/pacientes');
      console.log('✅ Lista de pacientes:', response.data);
    } catch (error) {
      console.log('❌ Error al obtener pacientes:', error.message);
    }

    console.log('🏁 Pruebas de endpoints autenticados completadas');
    
  } catch (error) {
    console.error('❌ Error general en pruebas autenticadas:', error);
  }
};

// Función helper para mostrar estado de la autenticación
export const showAuthStatus = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('🔐 Estado de autenticación:');
  console.log('- Token presente:', !!token);
  console.log('- Usuario presente:', !!user);
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('- Nombre de usuario:', userData.nombre);
      console.log('- Rol:', userData.rol_id);
      console.log('- Email:', userData.correo_electronico);
    } catch (error) {
      console.log('❌ Error al parsear datos del usuario');
    }
  }
};