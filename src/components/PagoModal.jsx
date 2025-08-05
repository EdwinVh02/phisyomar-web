import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  X, 
  DollarSign, 
  CreditCard, 
  Receipt,
  User,
  Calendar,
  Clock
} from 'lucide-react';

const PagoModal = ({ cita, tarifas, onProcesarPago, onCerrar }) => {
  const [datosPago, setDatosPago] = useState({
    monto: cita.costo_consulta || 0,
    forma_pago: 'efectivo',
    recibo: '',
    autorizacion: '',
    factura_emitida: false
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (campo, valor) => {
    setDatosPago(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onProcesarPago(datosPago);
    } catch (error) {
      console.error('Error al procesar pago:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatearHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  };

  const generarNumeroRecibo = () => {
    const fecha = new Date();
    const timestamp = fecha.getTime().toString().slice(-6);
    return `REC-${fecha.getFullYear()}${(fecha.getMonth() + 1).toString().padStart(2, '0')}${fecha.getDate().toString().padStart(2, '0')}-${timestamp}`;
  };

  const generarRecibo = () => {
    if (!datosPago.recibo) {
      handleInputChange('recibo', generarNumeroRecibo());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="border-0 shadow-xl">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <CreditCard className="w-6 h-6 mr-2" />
                Procesar Pago
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCerrar}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Información de la Cita */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Información de la Cita</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Paciente</p>
                    <p className="font-medium">
                      {cita.paciente?.usuario?.nombre} {cita.paciente?.usuario?.apellido_paterno}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Terapeuta</p>
                    <p className="font-medium">
                      {cita.terapeuta?.usuario?.nombre} {cita.terapeuta?.usuario?.apellido_paterno}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-medium">{formatearFecha(cita.fecha_hora)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600">Hora</p>
                    <p className="font-medium">{formatearHora(cita.fecha_hora)}</p>
                  </div>
                </div>
              </div>

              {cita.motivo && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600">Motivo</p>
                  <p className="font-medium">{cita.motivo}</p>
                </div>
              )}
            </div>

            {/* Formulario de Pago */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Monto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto a Pagar *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={datosPago.monto}
                      onChange={(e) => handleInputChange('monto', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Costo de consulta: {formatearMonto(cita.costo_consulta)}
                  </p>
                </div>

                {/* Forma de Pago */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forma de Pago *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={datosPago.forma_pago}
                    onChange={(e) => handleInputChange('forma_pago', e.target.value)}
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="terminal">Terminal (Tarjeta)</option>
                  </select>
                </div>

                {/* Número de Recibo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Recibo
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={datosPago.recibo}
                      onChange={(e) => handleInputChange('recibo', e.target.value)}
                      placeholder="Ingrese número de recibo"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-l-none border-l-0"
                      onClick={generarRecibo}
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      Generar
                    </Button>
                  </div>
                </div>

                {/* Autorización (para terminal) */}
                {datosPago.forma_pago === 'terminal' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código de Autorización
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={datosPago.autorizacion}
                      onChange={(e) => handleInputChange('autorizacion', e.target.value)}
                      placeholder="Código de autorización de la terminal"
                    />
                  </div>
                )}

                {/* Factura */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="factura_emitida"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={datosPago.factura_emitida}
                    onChange={(e) => handleInputChange('factura_emitida', e.target.checked)}
                  />
                  <label htmlFor="factura_emitida" className="ml-2 block text-sm text-gray-700">
                    ¿Requiere factura?
                  </label>
                </div>

                {/* Resumen del Pago */}
                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Resumen del Pago</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Monto:</span>
                      <span className="font-medium text-blue-900">{formatearMonto(datosPago.monto)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Forma de pago:</span>
                      <span className="font-medium text-blue-900 capitalize">{datosPago.forma_pago}</span>
                    </div>
                    {datosPago.recibo && (
                      <div className="flex justify-between">
                        <span className="text-blue-700">Recibo:</span>
                        <span className="font-medium text-blue-900">{datosPago.recibo}</span>
                      </div>
                    )}
                    {datosPago.factura_emitida && (
                      <div className="flex justify-between">
                        <span className="text-blue-700">Factura:</span>
                        <span className="font-medium text-blue-900">Sí</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCerrar}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading || datosPago.monto <= 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Procesar Pago
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PagoModal;