import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  DollarSign, 
  FileText, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Receipt,
  Wallet,
  TrendingUp
} from 'lucide-react';

export default function PagosFacturacion() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Datos de ejemplo - en producción vendrían de una API
  const pagosEjemplo = [
    {
      id: 1,
      fecha: '2025-01-15',
      concepto: 'Consulta de Fisioterapia',
      monto: 800,
      estado: 'pagado',
      metodoPago: 'Tarjeta de Crédito',
      numeroFactura: 'F-2025-001',
      terapeuta: 'Dr. Juan González',
      sesion: 'Rehabilitación lumbar',
      vencimiento: '2025-01-30'
    },
    {
      id: 2,
      fecha: '2025-01-08',
      concepto: 'Sesión de Rehabilitación',
      monto: 600,
      estado: 'pagado',
      metodoPago: 'Efectivo',
      numeroFactura: 'F-2025-002',
      terapeuta: 'Dr. Juan González',
      sesion: 'Terapia manual',
      vencimiento: '2025-01-23'
    },
    {
      id: 3,
      fecha: '2025-01-01',
      concepto: 'Evaluación Inicial',
      monto: 1200,
      estado: 'pendiente',
      metodoPago: 'Pendiente',
      numeroFactura: 'F-2025-003',
      terapeuta: 'Dr. Juan González',
      sesion: 'Evaluación completa',
      vencimiento: '2025-01-16'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setPagos(pagosEjemplo);
      setLoading(false);
    }, 1000);
  }, []);

  const filtrarPagos = () => {
    return pagos.filter(pago => {
      const cumpleEstado = !filtroEstado || pago.estado === filtroEstado;
      const cumpleFecha = !filtroFecha || pago.fecha.includes(filtroFecha);
      const cumpleBusqueda = !busqueda || 
        pago.concepto.toLowerCase().includes(busqueda.toLowerCase()) ||
        pago.numeroFactura.toLowerCase().includes(busqueda.toLowerCase()) ||
        pago.terapeuta.toLowerCase().includes(busqueda.toLowerCase());
      
      return cumpleEstado && cumpleFecha && cumpleBusqueda;
    });
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'pagado': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pendiente': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'vencido': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pagado': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'vencido': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPagado = pagos.filter(p => p.estado === 'pagado').reduce((sum, p) => sum + p.monto, 0);
  const totalPendiente = pagos.filter(p => p.estado === 'pendiente').reduce((sum, p) => sum + p.monto, 0);
  const totalGeneral = pagos.reduce((sum, p) => sum + p.monto, 0);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando información de pagos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagos y Facturación</h1>
        <p className="text-gray-600">Consulta tus pagos y facturas</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por concepto, factura o terapeuta..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
              <option value="vencido">Vencido</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Año
            </label>
            <input
              type="number"
              placeholder="2025"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total General</p>
              <p className="text-2xl font-bold text-gray-900">{formatearMonto(totalGeneral)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pagado</p>
              <p className="text-2xl font-bold text-gray-900">{formatearMonto(totalPagado)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pendiente</p>
              <p className="text-2xl font-bold text-gray-900">{formatearMonto(totalPendiente)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Receipt className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Facturas</p>
              <p className="text-2xl font-bold text-gray-900">{pagos.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Historial de Pagos */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Historial de Pagos</h3>
        </div>
        {filtrarPagos().length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron pagos
            </h3>
            <p className="text-gray-600">
              Ajusta los filtros para ver más resultados
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtrarPagos().map((pago) => (
              <div key={pago.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getEstadoIcon(pago.estado)}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{pago.concepto}</h4>
                      <p className="text-sm text-gray-600">{formatearFecha(pago.fecha)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{formatearMonto(pago.monto)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(pago.estado)}`}>
                      {pago.estado}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-600">Factura:</span>
                    <span className="text-sm font-medium ml-2">{pago.numeroFactura}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Terapeuta:</span>
                    <span className="text-sm font-medium ml-2">{pago.terapeuta}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Método de pago:</span>
                    <span className="text-sm font-medium ml-2">{pago.metodoPago}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Sesión:</span>
                    <span className="text-sm font-medium ml-2">{pago.sesion}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Vencimiento:</span>
                    <span className="text-sm font-medium ml-2">{formatearFecha(pago.vencimiento)}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    Ver Detalle
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    Descargar Factura
                  </button>
                  {pago.estado === 'pendiente' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                      <CreditCard className="w-4 h-4" />
                      Pagar Ahora
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}