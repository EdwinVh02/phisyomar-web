// Archivo temporal para debuggear el dashboard
import api from './api';

export const debugDashboard = async () => {
  try {
    console.log('🔍 Probando endpoint del dashboard...');
    
    // Simular token (usa el tuyo real)
    const token = localStorage.getItem('token');
    console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
    
    // Hacer petición al endpoint correcto
    const response = await api.get('/dashboard/stats');
    
    console.log('📊 Respuesta completa:', response);
    console.log('📊 Datos de respuesta:', response.data);
    
    if (response.data.success) {
      console.log('✅ Respuesta exitosa');
      console.log('📈 Conteos:', response.data.data.conteos);
    } else {
      console.log('❌ Respuesta no exitosa:', response.data.message);
    }
    
    return response.data;
    
  } catch (error) {
    console.error('❌ Error completo:', error);
    console.error('❌ Respuesta del error:', error.response?.data);
    console.error('❌ Status del error:', error.response?.status);
    throw error;
  }
};

// Para usar en la consola del navegador:
// import { debugDashboard } from './services/debugDashboard.js'
// debugDashboard()