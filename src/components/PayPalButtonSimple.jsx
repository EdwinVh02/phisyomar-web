import React, { useState } from 'react';
import { CheckCircle, XCircle, CreditCard, Loader, AlertCircle, ExternalLink } from 'lucide-react';

const PayPalButtonSimple = ({ 
  pago, 
  onSuccess, 
  onError, 
  onCancel,
  disabled = false 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const manejarPagoManual = () => {
    setLoading(true);
    
    // Simular procesamiento de pago
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      // Simular respuesta exitosa de PayPal
      const mockResponse = {
        id: `PAYPAL-${Date.now()}`,
        status: 'COMPLETED',
        pago_id: pago.id,
        monto: pago.monto,
        transaccion_id: `TXN-${Date.now()}`,
        fecha: new Date().toISOString(),
        detallesPayPal: {
          id: `PAYPAL-${Date.now()}`,
          status: 'COMPLETED',
          payer: {
            email_address: 'usuario@ejemplo.com',
            name: { given_name: 'Usuario', surname: 'Ejemplo' }
          }
        }
      };
      
      if (onSuccess) {
        onSuccess(mockResponse);
      }
    }, 2000);
  };

  const manejarPagoExterno = () => {
    // Abrir PayPal en nueva ventana para pago manual
    const paypalUrl = `https://www.paypal.com/paypalme/physiomartest/${pago.monto}?locale.x=es_MX`;
    window.open(paypalUrl, '_blank', 'width=600,height=700');
    
    // Mostrar instrucciones al usuario
    alert('Se abrió PayPal en una nueva ventana. Después de completar el pago, regresa aquí y haz clic en "Confirmar Pago".');
  };

  if (success) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
        <CheckCircle className="w-5 h-5" />
        <span className="font-medium">Pago procesado exitosamente</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200">
        <XCircle className="w-5 h-5" />
        <span className="font-medium">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Procesando pago...</span>
        </div>
      )}
      
      {/* Información del pago */}
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
        <p className="text-lg font-bold text-gray-900">${pago.monto} MXN</p>
        <p className="text-sm text-gray-600">{pago.concepto}</p>
        <p className="text-xs text-gray-500">Factura: {pago.numeroFactura}</p>
      </div>

      {/* Opciones de pago */}
      <div className="space-y-3">
        <button
          onClick={manejarPagoManual}
          disabled={disabled || loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <CreditCard className="w-5 h-5" />
          Pagar con Simulación (Demo)
        </button>

        <button
          onClick={manejarPagoExterno}
          disabled={disabled || loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <ExternalLink className="w-5 h-5" />
          Pagar con PayPal (Externo)
        </button>
      </div>

      {/* Métodos alternativos */}
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Métodos de pago alternativos</p>
            <ul className="text-xs text-yellow-700 mt-1 space-y-1">
              <li>• Efectivo en recepción</li>
              <li>• Transferencia bancaria</li>
              <li>• Tarjeta en clínica: 55-1234-5678</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center gap-1">
          <CreditCard className="w-3 h-3" />
          <span>Pago seguro - Clínica PhysioMar</span>
        </div>
      </div>
    </div>
  );
};

export default PayPalButtonSimple;