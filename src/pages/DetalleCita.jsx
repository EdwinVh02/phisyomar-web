import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCitaDetalle, cancelarCita } from '../services/citaService';
import { Calendar, Clock, User, MapPin, Activity, FileText, AlertCircle, ArrowLeft, Phone, Mail, Stethoscope, CheckCircle2, XCircle, Timer, Scale, Heart, Clipboard } from 'lucide-react';

export default function DetalleCita() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelando, setCancelando] = useState(false);

  // Formatear fecha y hora desde fecha_hora
  const formatearFechaHora = (fechaHora) => {
    if (!fechaHora) return { fecha: 'N/A', hora: 'N/A' };
    
    const date = new Date(fechaHora);
    const fecha = date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    const hora = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    return { fecha, hora };
  };

  useEffect(() => {
    const cargarDetalle = async () => {
      try {
        setLoading(true);
        const detalle = await getCitaDetalle(id);
        setCita(detalle);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      cargarDetalle();
    }
  }, [id]);

  const handleCancelar = async () => {
    if (window.confirm('¿Estás seguro que deseas cancelar esta cita?')) {
      try {
        setCancelando(true);
        await cancelarCita(id);
        setCita(prev => ({ ...prev, estado: 'cancelada' }));
        alert('Cita cancelada exitosamente');
      } catch (err) {
        alert('Error al cancelar la cita: ' + err.message);
      } finally {
        setCancelando(false);
      }
    }
  };

  const getEstadoConfig = (estado) => {
    switch (estado) {
      case 'agendada': 
        return {
          bg: 'bg-blue-500',
          text: 'text-white',
          icon: Clock,
          label: 'Agendada',
          bgLight: 'bg-blue-50',
          textLight: 'text-blue-700'
        };
      case 'atendida': 
        return {
          bg: 'bg-green-500',
          text: 'text-white',
          icon: CheckCircle2,
          label: 'Atendida',
          bgLight: 'bg-green-50',
          textLight: 'text-green-700'
        };
      case 'cancelada': 
        return {
          bg: 'bg-red-500',
          text: 'text-white',
          icon: XCircle,
          label: 'Cancelada',
          bgLight: 'bg-red-50',
          textLight: 'text-red-700'
        };
      case 'no_asistio': 
        return {
          bg: 'bg-gray-500',
          text: 'text-white',
          icon: AlertCircle,
          label: 'No asistió',
          bgLight: 'bg-gray-50',
          textLight: 'text-gray-700'
        };
      default: 
        return {
          bg: 'bg-gray-500',
          text: 'text-white',
          icon: Calendar,
          label: 'Pendiente',
          bgLight: 'bg-gray-50',
          textLight: 'text-gray-700'
        };
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando detalle de la cita...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar la cita</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => navigate('/paciente/mis-citas')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a Mis Citas
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cita) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cita no encontrada</h2>
            <p className="text-gray-600 mb-6">No se pudo encontrar la información de esta cita</p>
            <button 
              onClick={() => navigate('/paciente/mis-citas')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver a Mis Citas
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { fecha, hora } = formatearFechaHora(cita.fecha_hora);
  const estadoConfig = getEstadoConfig(cita.estado);
  const EstadoIcon = estadoConfig.icon;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate('/paciente/mis-citas')}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a Mis Citas</span>
          </button>
          
          <div className="flex items-center gap-4">
            {cita.estado === 'agendada' && (
              <button
                onClick={handleCancelar}
                disabled={cancelando}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 transition-colors"
              >
                <XCircle className="w-5 h-5" />
                {cancelando ? 'Cancelando...' : 'Cancelar Cita'}
              </button>
            )}
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Detalle de Cita</h1>
        <p className="text-gray-600">Información completa de tu cita</p>
      </div>

      {/* Header with status */}
      <div className={`${estadoConfig.bg} text-white rounded-xl mb-6`}>
        <div className="px-6 py-4">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <EstadoIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Cita #{cita.id}
              </h1>
              <div className="flex items-center gap-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {estadoConfig.label}
                </span>
                <span className="text-white/80">•</span>
                <span className="text-white/80">{fecha} a las {hora}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información Básica */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Información de la Cita</h2>
                <p className="text-gray-500 text-sm">Detalles de tu consulta</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-semibold text-gray-900">{fecha}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Hora</p>
                  <p className="font-semibold text-gray-900">{hora}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Stethoscope className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Tipo de consulta</p>
                  <p className="font-semibold text-gray-900">{cita.tipo}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Timer className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Duración</p>
                  <p className="font-semibold text-gray-900">{cita.duracion || 60} minutos</p>
                </div>
              </div>
              
              {cita.ubicacion && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Ubicación</p>
                    <p className="font-semibold text-gray-900">{cita.ubicacion}</p>
                  </div>
                </div>
              )}
              
              {cita.equipo_asignado && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Equipo asignado</p>
                    <p className="font-semibold text-gray-900">{cita.equipo_asignado}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información del Terapeuta */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tu Terapeuta</h2>
                <p className="text-gray-500 text-sm">Profesional asignado</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-center pb-4 border-b border-gray-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {cita.terapeuta?.usuario?.nombre} {cita.terapeuta?.usuario?.apellido_paterno}
                </h3>
                <p className="text-green-600 font-medium">
                  {cita.terapeuta?.especialidad_principal || 'Fisioterapeuta'}
                </p>
              </div>
              
              {cita.terapeuta?.cedula_profesional && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Cédula profesional</p>
                    <p className="font-semibold text-gray-900">{cita.terapeuta.cedula_profesional}</p>
                  </div>
                </div>
              )}
              
              {cita.terapeuta?.usuario?.telefono && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Teléfono</p>
                    <p className="font-semibold text-gray-900">{cita.terapeuta.usuario.telefono}</p>
                  </div>
                </div>
              )}
              
              {cita.terapeuta?.usuario?.correo_electronico && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Correo</p>
                    <p className="font-semibold text-gray-900">{cita.terapeuta.usuario.correo_electronico}</p>
                  </div>
                </div>
              )}
              
              {cita.terapeuta?.experiencia_anios && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Heart className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Experiencia</p>
                    <p className="font-semibold text-gray-900">{cita.terapeuta.experiencia_anios} años</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información Clínica */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clipboard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Información Clínica</h2>
                <p className="text-gray-500 text-sm">Detalles médicos importantes</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Motivo de la consulta</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {cita.motivo || 'No especificado'}
                </p>
              </div>
              
              {cita.escala_dolor_eva_inicio !== null && cita.escala_dolor_eva_inicio !== undefined && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-5 h-5 text-red-600" />
                    <h3 className="font-semibold text-gray-900">Escala de Dolor (EVA)</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-red-600">{cita.escala_dolor_eva_inicio}</span>
                    <span className="text-gray-600">/10</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 ml-3">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(cita.escala_dolor_eva_inicio / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              
              {cita.como_fue_lesion && (
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-900">Mecanismo de lesión</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {cita.como_fue_lesion}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Antecedentes Médicos - Sección completa */}
        {(cita.antecedentes_patologicos || cita.antecedentes_no_patologicos || cita.observaciones) && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Antecedentes Médicos</h2>
                <p className="text-gray-500 text-sm">Historial clínico del paciente</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cita.antecedentes_patologicos && (
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">Antecedentes Patológicos</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {cita.antecedentes_patologicos}
                  </p>
                </div>
              )}
              
              {cita.antecedentes_no_patologicos && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Antecedentes No Patológicos</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {cita.antecedentes_no_patologicos}
                  </p>
                </div>
              )}
              
              {cita.observaciones && (
                <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Clipboard className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Observaciones Adicionales</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {cita.observaciones}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}