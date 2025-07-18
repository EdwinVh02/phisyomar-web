import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function CalendarioCitas({ 
  terapeutaId, 
  duracion = 60, 
  onDateTimeSelect,
  value = null 
}) {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [datosCalendario, setDatosCalendario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostrarHoras, setMostrarHoras] = useState(false);
  const [error, setError] = useState(null);

  // Parse initial value
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const fechaStr = date.toISOString().split('T')[0];
        const horaStr = date.toTimeString().slice(0, 5);
        setFechaSeleccionada(fechaStr);
        setHoraSeleccionada(horaStr);
        setFechaActual(date);
      }
    }
  }, [value]);

  const cargarDatos = async () => {
    if (!terapeutaId) {
      setError('No se ha especificado un terapeuta');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/citas/calendario-disponibilidad', {
        terapeuta_id: terapeutaId,
        mes: fechaActual.getMonth() + 1,
        anio: fechaActual.getFullYear(),
        duracion: duracion
      });

      setDatosCalendario(response.data);
    } catch (error) {
      console.error('Error al cargar disponibilidad:', error);
      setError('Error al cargar la disponibilidad del calendario');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (terapeutaId) {
      cargarDatos();
    }
  }, [terapeutaId, fechaActual, duracion]);

  const cambiarMes = (direccion) => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + direccion);
    setFechaActual(nuevaFecha);
    setFechaSeleccionada(null);
    setHoraSeleccionada(null);
    setMostrarHoras(false);
  };

  const seleccionarFecha = (fecha, datoDia) => {
    if (!datoDia.disponible) return;
    
    setFechaSeleccionada(fecha);
    setHoraSeleccionada(null);
    setMostrarHoras(true);
  };

  const seleccionarHora = (hora) => {
    setHoraSeleccionada(hora);
    const fechaHora = `${fechaSeleccionada} ${hora}:00`;
    if (onDateTimeSelect) {
      onDateTimeSelect(fechaHora);
    }
  };

  const renderCalendario = () => {
    if (!datosCalendario?.calendario) return null;

    const primerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    const ultimoDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 0);
    const diaInicio = primerDia.getDay() === 0 ? 6 : primerDia.getDay() - 1;

    const dias = [];

    // Días vacíos al inicio
    for (let i = 0; i < diaInicio; i++) {
      dias.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Días del mes
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      const fechaStr = `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const datoDia = datosCalendario.calendario[fechaStr];
      
      let clasesDia = 'h-10 w-10 flex items-center justify-center text-sm font-medium rounded-lg transition-all duration-200';
      let titulo = '';
      let clickeable = false;
      
      if (datoDia) {
        if (datoDia.disponible) {
          clasesDia += ' bg-green-100 text-green-800 hover:bg-green-200 border-2 border-green-300 cursor-pointer';
          titulo = `${datoDia.total_disponibles} horas disponibles`;
          clickeable = true;
        } else if (datoDia.motivo === 'domingo') {
          clasesDia += ' bg-gray-100 text-gray-400 cursor-not-allowed';
          titulo = 'Domingo - No laboral';
        } else if (datoDia.motivo === 'fecha_pasada') {
          clasesDia += ' bg-gray-100 text-gray-400 cursor-not-allowed';
          titulo = 'Fecha pasada';
        } else {
          clasesDia += ' bg-red-100 text-red-800 cursor-not-allowed';
          titulo = 'Sin horarios disponibles';
        }
      } else {
        clasesDia += ' bg-gray-100 text-gray-400 cursor-not-allowed';
        titulo = 'Sin información';
      }

      if (fechaSeleccionada === fechaStr) {
        clasesDia += ' ring-2 ring-blue-500 bg-blue-100 text-blue-800';
      }

      dias.push(
        <div
          key={dia}
          className={clasesDia}
          title={titulo}
          onClick={() => clickeable && seleccionarFecha(fechaStr, datoDia)}
        >
          {dia}
        </div>
      );
    }

    return dias;
  };

  const renderSelectorHoras = () => {
    if (!mostrarHoras || !fechaSeleccionada || !datosCalendario?.calendario) return null;

    const datoDia = datosCalendario.calendario[fechaSeleccionada];
    if (!datoDia || !datoDia.disponible) return null;

    const horasDisponibles = datoDia.horas_disponibles || [];
    const horasOcupadas = datoDia.horas_ocupadas || [];
    const todasLasHoras = [...horasDisponibles, ...horasOcupadas].sort();

    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Selecciona una hora para el {new Date(fechaSeleccionada).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}:
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {todasLasHoras.map((hora) => {
            const disponible = horasDisponibles.includes(hora);
            const seleccionada = horaSeleccionada === hora;
            
            let clases = 'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200';
            
            if (disponible) {
              clases += seleccionada 
                ? ' bg-blue-600 text-white ring-2 ring-blue-400'
                : ' bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer';
            } else {
              clases += ' bg-red-100 text-red-600 cursor-not-allowed opacity-60';
            }

            return (
              <button
                key={hora}
                type="button"
                className={clases}
                disabled={!disponible}
                onClick={() => seleccionarHora(hora)}
                title={disponible ? 'Hora disponible' : 'Hora ocupada'}
              >
                {hora}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const nombreMes = new Intl.DateTimeFormat('es-ES', { 
    month: 'long', 
    year: 'numeric' 
  }).format(fechaActual);

  return (
    <div className="calendario-citas bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => cambiarMes(-1)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-xl font-semibold text-gray-800">
          {nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)}
        </h3>
        
        <button
          type="button"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => cambiarMes(1)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Cargando disponibilidad...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Calendar Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(dia => (
              <div key={dia} className="h-10 flex items-center justify-center text-sm font-medium text-gray-500">
                {dia}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {renderCalendario()}
          </div>
        </>
      )}

      {/* Time Selector */}
      {renderSelectorHoras()}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
            <span className="text-gray-600">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 rounded"></div>
            <span className="text-gray-600">Ocupado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 rounded"></div>
            <span className="text-gray-600">No laboral</span>
          </div>
        </div>
      </div>
    </div>
  );
}