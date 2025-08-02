import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { crearOrdenPago, confirmarPago } from '../services/pagoService';
import { CheckCircle, XCircle, CreditCard, Loader, AlertCircle } from 'lucide-react';

// Configuración de PayPal
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R";
const PAYPAL_ENVIRONMENT = import.meta.env.VITE_PAYPAL_ENVIRONMENT || "sandbox";

const PayPalButton = ({ 
  pago, 
  onSuccess, 
  onError, 
  onCancel,
  disabled = false 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [paypalError, setPaypalError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  // Verificar si PayPal está disponible después de un tiempo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!success && !loading && !error) {
        // Si después de 5 segundos no se ha cargado PayPal, mostrar fallback
        setShowFallback(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [success, loading, error]);

  const createOrder = async (data, actions) => {
    try {
      setLoading(true);
      setError('');

      // Crear orden en nuestro backend
      const ordenData = {
        pagoId: pago.id,
        monto: pago.monto,
        concepto: pago.concepto,
        numeroFactura: pago.numeroFactura
      };

      const orden = await crearOrdenPago(ordenData);

      // Crear orden en PayPal
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: "MXN",
              value: pago.monto.toString()
            },
            description: pago.concepto,
            custom_id: pago.numeroFactura,
            invoice_id: pago.numeroFactura
          }
        ],
        application_context: {
          brand_name: "Clínica PhysioMar",
          locale: "es-MX",
          user_action: "PAY_NOW",
          return_url: `${window.location.origin}/paciente/pagos?success=true`,
          cancel_url: `${window.location.origin}/paciente/pagos?cancelled=true`
        }
      });
    } catch (error) {
      console.error('Error al crear orden:', error);
      setError('Error al inicializar el pago');
      if (onError) onError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data, actions) => {
    try {
      setLoading(true);
      setError('');

      // Capturar el pago en PayPal
      const details = await actions.order.capture();
      
      console.log('Pago capturado:', details);

      // Confirmar el pago en nuestro backend
      const confirmacion = await confirmarPago(data.orderID, {
        paypalOrderId: data.orderID,
        paypalPayerId: data.payerID,
        detallesPago: details,
        pagoId: pago.id
      });

      setSuccess(true);
      
      if (onSuccess) {
        onSuccess({
          ...confirmacion,
          detallesPayPal: details
        });
      }

    } catch (error) {
      console.error('Error al confirmar pago:', error);
      setError('Error al procesar el pago');
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  const onErrorHandler = (error) => {
    console.error('Error de PayPal:', error);
    setError('Error en el sistema de pagos');
    if (onError) onError(error);
  };

  const onCancelHandler = (data) => {
    console.log('Pago cancelado:', data);
    if (onCancel) onCancel(data);
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

  // Fallback si hay problemas con PayPal
  const [paypalError, setPaypalError] = useState(false);

  return (
    <div className="space-y-3">
      {loading && (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Procesando pago...</span>
        </div>
      )}
      
      {paypalError ? (
        // Fallback cuando PayPal no se puede cargar
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-4 py-3 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium">PayPal temporalmente no disponible</p>
              <p className="text-sm">Puedes pagar directamente en nuestra clínica o contactar a recepción.</p>
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-medium">Monto a pagar: ${pago.monto} MXN</p>
            <p className="text-xs text-gray-500 mt-1">Concepto: {pago.concepto}</p>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Opciones de pago alternativas:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Efectivo en recepción</li>
              <li>Transferencia bancaria</li>
              <li>Tarjeta de débito/crédito en clínica</li>
            </ul>
          </div>
        </div>
      ) : (
        <PayPalScriptProvider 
          options={{ 
            "client-id": PAYPAL_CLIENT_ID,
            currency: "MXN",
            locale: "es_MX"
          }}
          onLoadScript={(result) => {
            if (result && result.error) {
              console.error('Error loading PayPal script:', result.error);
              setPaypalError(true);
            }
          }}
        >
          <PayPalButtons
            disabled={disabled || loading}
            style={{
              layout: "vertical",
              color: "blue",
              shape: "rect",
              label: "pay",
              height: 45
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={(error) => {
              console.error('PayPal error:', error);
              setPaypalError(true);
              onErrorHandler(error);
            }}
            onCancel={onCancelHandler}
          />
        </PayPalScriptProvider>
      )}
      
      {!paypalError && (
        <div className="text-xs text-gray-500 text-center">
          <div className="flex items-center justify-center gap-1">
            <CreditCard className="w-3 h-3" />
            <span>Pago seguro con PayPal</span>
          </div>
          <p className="mt-1">Monto: ${pago.monto} MXN</p>
        </div>
      )}
    </div>
  );
};

export default PayPalButton;