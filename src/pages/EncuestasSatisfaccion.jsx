import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MessageSquare, 
  BarChart3, 
  TrendingUp, 
  Award,
  Filter,
  Search,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Calendar
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

export default function EncuestasSatisfaccion() {
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [encuestaActiva, setEncuestaActiva] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [respuestas, setRespuestas] = useState({});
  const { showSuccess } = useToast();

  // Datos de ejemplo - en producción vendrían de una API
  const encuestasEjemplo = [
    {
      id: 1,
      titulo: 'Evaluación de Consulta - Dr. Juan González',
      fecha: '2025-01-15',
      estado: 'pendiente',
      terapeuta: 'Dr. Juan González',
      tipoConsulta: 'Fisioterapia',
      fechaConsulta: '2025-01-15',
      preguntas: [
        { id: 1, pregunta: '¿Cómo calificarías la atención recibida?', tipo: 'rating', respuesta: null },
        { id: 2, pregunta: '¿El terapeuta explicó claramente tu diagnóstico?', tipo: 'rating', respuesta: null },
        { id: 3, pregunta: '¿Te sientes satisfecho con el tratamiento?', tipo: 'rating', respuesta: null },
        { id: 4, pregunta: 'Comentarios adicionales', tipo: 'texto', respuesta: null }
      ]
    },
    {
      id: 2,
      titulo: 'Evaluación de Consulta - Dr. Juan González',
      fecha: '2025-01-08',
      estado: 'completada',
      terapeuta: 'Dr. Juan González',
      tipoConsulta: 'Evaluación Inicial',
      fechaConsulta: '2025-01-08',
      calificacionPromedio: 4.5,
      preguntas: [
        { id: 1, pregunta: '¿Cómo calificarías la atención recibida?', tipo: 'rating', respuesta: 5 },
        { id: 2, pregunta: '¿El terapeuta explicó claramente tu diagnóstico?', tipo: 'rating', respuesta: 4 },
        { id: 3, pregunta: '¿Te sientes satisfecho con el tratamiento?', tipo: 'rating', respuesta: 5 },
        { id: 4, pregunta: 'Comentarios adicionales', tipo: 'texto', respuesta: 'Excelente atención, muy profesional.' }
      ]
    },
    {
      id: 3,
      titulo: 'Evaluación de Consulta - Dr. Juan González',
      fecha: '2025-01-01',
      estado: 'vencida',
      terapeuta: 'Dr. Juan González',
      tipoConsulta: 'Rehabilitación',
      fechaConsulta: '2025-01-01',
      calificacionPromedio: 0,
      preguntas: []
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setEncuestas(encuestasEjemplo);
      setLoading(false);
    }, 1000);
  }, []);

  const filtrarEncuestas = () => {
    return encuestas.filter(encuesta => {
      const cumpleEstado = !filtroEstado || encuesta.estado === filtroEstado;
      const cumpleBusqueda = !busqueda || 
        encuesta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        encuesta.terapeuta.toLowerCase().includes(busqueda.toLowerCase()) ||
        encuesta.tipoConsulta.toLowerCase().includes(busqueda.toLowerCase());
      
      return cumpleEstado && cumpleBusqueda;
    });
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'completada': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pendiente': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'vencida': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'vencida': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRespuestaChange = (preguntaId, valor) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: valor
    }));
  };

  const handleEnviarEncuesta = () => {
    // Simular envío de encuesta
    showSuccess('Encuesta enviada exitosamente. ¡Gracias por tu retroalimentación!');
    setEncuestaActiva(null);
    setRespuestas({});
    
    // Actualizar estado de la encuesta
    setEncuestas(prev => prev.map(enc => 
      enc.id === encuestaActiva.id 
        ? { ...enc, estado: 'completada' }
        : enc
    ));
  };

  const renderStars = (rating, onRatingChange = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => onRatingChange && onRatingChange(i)}
          className={`w-6 h-6 ${
            i <= rating 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300'
          } ${onRatingChange ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
          disabled={!onRatingChange}
        >
          <Star className="w-full h-full" />
        </button>
      );
    }
    return stars;
  };

  const encuestasCompletadas = encuestas.filter(e => e.estado === 'completada').length;
  const encuestasPendientes = encuestas.filter(e => e.estado === 'pendiente').length;
  const promedioSatisfaccion = encuestas
    .filter(e => e.estado === 'completada' && e.calificacionPromedio)
    .reduce((sum, e) => sum + e.calificacionPromedio, 0) / 
    encuestas.filter(e => e.estado === 'completada' && e.calificacionPromedio).length || 0;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando encuestas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (encuestaActiva) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Completar Encuesta</h1>
          <p className="text-gray-600">Tu opinión es importante para nosotros</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{encuestaActiva.titulo}</h3>
          </div>
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Terapeuta:</span>
                  <span className="text-sm font-medium ml-2">{encuestaActiva.terapeuta}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Tipo de consulta:</span>
                  <span className="text-sm font-medium ml-2">{encuestaActiva.tipoConsulta}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Fecha de consulta:</span>
                  <span className="text-sm font-medium ml-2">{formatearFecha(encuestaActiva.fechaConsulta)}</span>
                </div>
              </div>
            </div>

            {encuestaActiva.preguntas.map((pregunta) => (
              <div key={pregunta.id} className="space-y-3">
                <h4 className="font-medium text-gray-900">{pregunta.pregunta}</h4>
                {pregunta.tipo === 'rating' ? (
                  <div className="flex items-center gap-2">
                    {renderStars(respuestas[pregunta.id] || 0, (rating) => handleRespuestaChange(pregunta.id, rating))}
                    <span className="text-sm text-gray-500 ml-2">
                      {respuestas[pregunta.id] ? `${respuestas[pregunta.id]} de 5` : 'Selecciona una calificación'}
                    </span>
                  </div>
                ) : (
                  <textarea
                    value={respuestas[pregunta.id] || ''}
                    onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
                    placeholder="Comparte tus comentarios..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                  />
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleEnviarEncuesta}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Enviar Encuesta
              </button>
              <button
                onClick={() => setEncuestaActiva(null)}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Encuestas de Satisfacción</h1>
        <p className="text-gray-600">Comparte tu opinión sobre nuestros servicios</p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título, terapeuta o tipo de consulta..."
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
              <option value="pendiente">Pendiente</option>
              <option value="completada">Completada</option>
              <option value="vencida">Vencida</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Encuestas</p>
              <p className="text-2xl font-bold text-gray-900">{encuestas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completadas</p>
              <p className="text-2xl font-bold text-gray-900">{encuestasCompletadas}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{encuestasPendientes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Satisfacción</p>
              <p className="text-2xl font-bold text-gray-900">
                {promedioSatisfaccion ? `${promedioSatisfaccion.toFixed(1)}/5` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Encuestas */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Mis Encuestas</h3>
        </div>
        {filtrarEncuestas().length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron encuestas
            </h3>
            <p className="text-gray-600">
              Ajusta los filtros para ver más resultados
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtrarEncuestas().map((encuesta) => (
              <div key={encuesta.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getEstadoIcon(encuesta.estado)}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{encuesta.titulo}</h4>
                      <p className="text-sm text-gray-600">{formatearFecha(encuesta.fecha)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(encuesta.estado)}`}>
                      {encuesta.estado}
                    </span>
                    {encuesta.estado === 'completada' && encuesta.calificacionPromedio && (
                      <div className="flex items-center gap-1 ml-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{encuesta.calificacionPromedio}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-sm text-gray-600">Terapeuta:</span>
                    <span className="text-sm font-medium ml-2">{encuesta.terapeuta}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Tipo:</span>
                    <span className="text-sm font-medium ml-2">{encuesta.tipoConsulta}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Fecha consulta:</span>
                    <span className="text-sm font-medium ml-2">{formatearFecha(encuesta.fechaConsulta)}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  {encuesta.estado === 'pendiente' && (
                    <button 
                      onClick={() => setEncuestaActiva(encuesta)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Completar Encuesta
                    </button>
                  )}
                  {encuesta.estado === 'completada' && (
                    <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                      Ver Respuestas
                    </button>
                  )}
                  {encuesta.estado === 'vencida' && (
                    <span className="text-sm text-red-600 italic">Encuesta vencida</span>
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