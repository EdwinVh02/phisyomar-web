import api from './api';

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

// Datos de ejemplo para desarrollo
const getPagosEjemplo = () => {
  return [
    {
      id: 1,
      fecha: '2025-01-15',
      concepto: 'Consulta de Fisioterapia',
      monto: 800,
      estado: 'pagado',
      metodoPago: 'PayPal',
      numeroFactura: 'F-2025-001',
      terapeuta: 'Dr. Juan González',
      sesion: 'Rehabilitación lumbar',
      vencimiento: '2025-01-30',
      transaccionId: 'PAYPAL-12345'
    },
    {
      id: 2,
      fecha: '2025-01-08',
      concepto: 'Sesión de Rehabilitación',
      monto: 600,
      estado: 'pagado',
      metodoPago: 'PayPal',
      numeroFactura: 'F-2025-002',
      terapeuta: 'Dr. Juan González',
      sesion: 'Terapia manual',
      vencimiento: '2025-01-23',
      transaccionId: 'PAYPAL-12346'
    },
    {
      id: 3,
      fecha: '2025-01-01',
      concepto: 'Evaluación Inicial',
      monto: 1,
      estado: 'pendiente',
      metodoPago: 'Pendiente',
      numeroFactura: 'F-2025-003',
      terapeuta: 'Dr. Juan González',
      sesion: 'Evaluación completa',
      vencimiento: '2025-01-16'
    },
    {
      id: 4,
      fecha: '2024-12-20',
      concepto: 'Terapia de Rehabilitación',
      monto: 950,
      estado: 'pendiente',
      metodoPago: 'Pendiente',
      numeroFactura: 'F-2024-045',
      terapeuta: 'Dra. María López',
      sesion: 'Rehabilitación de rodilla',
      vencimiento: '2025-01-05'
    }
  ];
};

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
    // Simulación de descarga para desarrollo
    if (error.response?.status === 404) {
      console.log('ℹ️ Simulando descarga de factura');
      const fakeContent = `Factura No. ${facturaId}\nClínica PhysioMar\nTotal: $${Math.random() * 1000 + 500}\nFecha: ${new Date().toLocaleDateString()}`;
      const blob = new Blob([fakeContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `factura-${facturaId}.txt`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return true;
    }
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