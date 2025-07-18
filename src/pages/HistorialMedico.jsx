import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar, 
  User, 
  Stethoscope, 
  Activity, 
  Heart, 
  Download,
  Eye,
  Filter,
  Search,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function HistorialMedico() {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Datos de ejemplo - en producción vendrían de una API
  const historialEjemplo = [
    {
      id: 1,
      fecha: '2025-01-15',
      tipo: 'Consulta General',
      terapeuta: 'Dr. Juan González',
      diagnostico: 'Lumbalgia crónica',
      tratamiento: 'Ejercicios de fortalecimiento y fisioterapia',
      observaciones: 'Paciente muestra mejoría significativa en movilidad',
      estado: 'completada',
      duracion: 60,
      ubicacion: 'Consultorio 1'
    },
    {
      id: 2,
      fecha: '2025-01-08',
      tipo: 'Fisioterapia',
      terapeuta: 'Dr. Juan González',
      diagnostico: 'Rehabilitación post-quirúrgica',
      tratamiento: 'Terapia manual y ejercicios específicos',
      observaciones: 'Evolución favorable, continuar con el protocolo',
      estado: 'completada',
      duracion: 45,
      ubicacion: 'Sala de Rehabilitación'
    },
    {
      id: 3,
      fecha: '2025-01-01',
      tipo: 'Evaluación Inicial',
      terapeuta: 'Dr. Juan González',
      diagnostico: 'Dolor lumbar mecánico',
      tratamiento: 'Plan de tratamiento establecido',
      observaciones: 'Primera consulta, evaluación completa realizada',
      estado: 'completada',
      duracion: 90,
      ubicacion: 'Consultorio 2'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setHistorial(historialEjemplo);
      setLoading(false);
    }, 1000);
  }, []);

  const filtrarHistorial = () => {
    return historial.filter(item => {
      const cumpleFecha = !filtroFecha || item.fecha.includes(filtroFecha);
      const cumpleTipo = !filtroTipo || item.tipo === filtroTipo;
      const cumpleBusqueda = !busqueda || 
        item.diagnostico.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.tratamiento.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.terapeuta.toLowerCase().includes(busqueda.toLowerCase());
      
      return cumpleFecha && cumpleTipo && cumpleBusqueda;
    });
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'completada': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelada': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const tiposConsulta = [...new Set(historial.map(item => item.tipo))];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando historial médico...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Historial Médico</h1>
        <p className="text-gray-600">Consulta tu historial médico completo</p>
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
                placeholder="Buscar por diagnóstico, tratamiento o terapeuta..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Consulta
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los tipos</option>
              {tiposConsulta.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
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

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Consultas</p>
              <p className="text-2xl font-bold text-gray-900">{historial.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Consultas Completadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {historial.filter(h => h.estado === 'completada').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Horas de Tratamiento</p>
              <p className="text-2xl font-bold text-gray-900">
                {historial.reduce((total, h) => total + h.duracion, 0) / 60}h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Historial */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Historial de Consultas</h3>
        </div>
        {filtrarHistorial().length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron consultas
            </h3>
            <p className="text-gray-600">
              Ajusta los filtros para ver más resultados
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtrarHistorial().map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getEstadoIcon(item.estado)}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{item.tipo}</h4>
                      <p className="text-sm text-gray-600">{formatearFecha(item.fecha)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(item.estado)}`}>
                      {item.estado}
                    </span>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Terapeuta:</span>
                    <span className="text-sm font-medium">{item.terapeuta}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Duración:</span>
                    <span className="text-sm font-medium">{item.duracion} minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Ubicación:</span>
                    <span className="text-sm font-medium">{item.ubicacion}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Diagnóstico:</span>
                    <span className="text-sm font-medium">{item.diagnostico}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Tratamiento:</h5>
                    <p className="text-sm text-gray-600">{item.tratamiento}</p>
                  </div>
                  {item.observaciones && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Observaciones:</h5>
                      <p className="text-sm text-gray-600">{item.observaciones}</p>
                    </div>
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