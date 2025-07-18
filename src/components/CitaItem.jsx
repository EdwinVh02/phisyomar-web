import React from "react";
import { Eye, XCircle, Clock, CheckCircle2, AlertCircle, Calendar } from "lucide-react";

export default function CitaItem({ cita, zebra, onCancelar, onVerDetalle }) {
  // Formatear fecha y hora desde fecha_hora
  const formatearFechaHora = (fechaHora) => {
    if (!fechaHora) return { fecha: 'N/A', hora: 'N/A' };
    
    const date = new Date(fechaHora);
    const fecha = date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const hora = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    return { fecha, hora };
  };

  const { fecha, hora } = formatearFechaHora(cita.fecha_hora);

  // Obtener estilo del estado
  const getEstadoStyle = (estado) => {
    switch (estado) {
      case 'agendada':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: Clock,
          label: 'Agendada'
        };
      case 'atendida':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: CheckCircle2,
          label: 'Atendida'
        };
      case 'cancelada':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: XCircle,
          label: 'Cancelada'
        };
      case 'no_asistio':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: AlertCircle,
          label: 'No asistió'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: Calendar,
          label: 'Pendiente'
        };
    }
  };

  const estadoStyle = getEstadoStyle(cita.estado);
  const EstadoIcon = estadoStyle.icon;

  return (
    <tr className={`transition-colors hover:bg-blue-50 ${zebra ? "bg-gray-50" : "bg-white"}`}>
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{fecha}</p>
            <p className="text-sm text-gray-500">
              {cita.terapeuta?.usuario?.nombre} {cita.terapeuta?.usuario?.apellido_paterno}
            </p>
          </div>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-900">{hora}</span>
        </div>
        <p className="text-sm text-gray-500">{cita.duracion || 60} minutos</p>
      </td>
      
      <td className="py-4 px-6">
        <div className="space-y-2">
          {cita.motivo && (
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
              <span className="text-sm text-gray-700 line-clamp-2">{cita.motivo}</span>
            </div>
          )}
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${estadoStyle.bg} ${estadoStyle.text}`}>
            <EstadoIcon className="w-3 h-3" />
            {estadoStyle.label}
          </div>
        </div>
      </td>
      
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onVerDetalle?.(cita)}
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
            title="Ver detalle"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Ver</span>
          </button>
          
          {cita.estado === 'agendada' && (
            <button
              onClick={() => onCancelar?.(cita)}
              className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors shadow-sm"
              title="Cancelar cita"
            >
              <XCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Cancelar</span>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
