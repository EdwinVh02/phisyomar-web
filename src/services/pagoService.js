import api from './api';

// Obtener todos los pagos (para administradores)
export const getPagos = async () => {
  try {
    console.log('🔍 Obteniendo pagos desde la base de datos...');
    const response = await api.get('/pagos');
    console.log('✅ Pagos obtenidos:', response.data);
    return response.data?.data || response.data || [];
  } catch (error) {
    console.error('❌ Error al obtener pagos:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener pagos');
  }
};

// Crear orden de pago
export const crearOrdenPago = async (pagoData) => {
  try {
    console.log('🔄 Creando orden de pago...', pagoData);
    const response = await api.post('/pagos/crear-orden', pagoData);
    console.log('✅ Orden creada:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al crear orden:', error);
    throw new Error(error.response?.data?.message || 'Error al crear orden de pago');
  }
};

// Confirmar pago con PayPal
export const confirmarPago = async (orderId, detallesPago) => {
  try {
    console.log('🔄 Confirmando pago...', { orderId, detallesPago });
    const response = await api.post('/pagos/confirmar', {
      orderId,
      detallesPago
    });
    console.log('✅ Pago confirmado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al confirmar pago:', error);
    throw new Error(error.response?.data?.message || 'Error al confirmar pago');
  }
};

// Obtener historial de pagos del paciente
export const getHistorialPagos = async () => {
  try {
    console.log('🔄 Obteniendo historial de pagos...');
    const response = await api.get('/paciente/pagos');
    console.log('✅ Historial obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener historial:', error);
    // Fallback con datos de ejemplo si el endpoint no existe
    if (error.response?.status === 404) {
      console.log('ℹ️ Endpoint no encontrado, retornando datos de ejemplo');
      return getPagosEjemplo();
    }
    throw new Error(error.response?.data?.message || 'Error al obtener historial de pagos');
  }
};

// Función removida - ya no se usan datos hardcodeados

// Descargar factura
export const descargarFactura = async (facturaId) => {
  try {
    console.log('🔄 Descargando factura...', facturaId);
    const response = await api.get(`/pagos/factura/${facturaId}`, {
      responseType: 'blob'
    });
    
    // Crear enlace de descarga
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `factura-${facturaId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    console.log('✅ Factura descargada');
    return true;
  } catch (error) {
    console.error('❌ Error al descargar factura:', error);
    throw new Error(error.response?.data?.message || 'Error al descargar factura');
  }
};

// Obtener detalles de un pago específico
export const getDetallePago = async (pagoId) => {
  try {
    console.log('🔄 Obteniendo detalle del pago...', pagoId);
    const response = await api.get(`/pagos/${pagoId}`);
    console.log('✅ Detalle obtenido:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al obtener detalle:', error);
    throw new Error(error.response?.data?.message || 'Error al obtener detalle del pago');
  }
};

// Cancelar pago pendiente
export const cancelarPago = async (pagoId) => {
  try {
    console.log('🔄 Cancelando pago...', pagoId);
    const response = await api.put(`/pagos/${pagoId}/cancelar`);
    console.log('✅ Pago cancelado:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error al cancelar pago:', error);
    throw new Error(error.response?.data?.message || 'Error al cancelar pago');
  }
};