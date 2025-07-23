import { Calendar, Search, CheckCircle, X, Clock, User } from "lucide-react";
import { useState, useEffect } from "react";
import { getMisCitasTerapeuta } from "../services/citaService";
import { actualizarEstadoCita } from "../services/terapeutaService";

export default function TerapeutaCitas() {
  const [search, setSearch] = useState("");
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todas');

  // Cargar citas al montar el componente
  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMisCitasTerapeuta();
      setCitas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstadoCita = async (citaId, nuevoEstado) => {
    try {
      await actualizarEstadoCita(citaId, nuevoEstado);
      await cargarCitas(); // Recargar las citas
    } catch (err) {
      alert('Error al actualizar la cita: ' + err.message);
    }
  };

  const citasFiltradas = citas.filter(cita => {
    const nombrePaciente = `${cita.paciente?.usuario?.nombre || ''} ${cita.paciente?.usuario?.apellido || ''}`.toLowerCase();
    const cumpleBusqueda = nombrePaciente.includes(search.toLowerCase());
    const cumpleEstado = filtroEstado === 'todas' || cita.estado === filtroEstado;
    
    return cumpleBusqueda && cumpleEstado;
  });

  const formatearFecha = (fechaHora) => {
    const fecha = new Date(fechaHora);
    return fecha.toLocaleDateString('es-MX', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatearHora = (fechaHora) => {
    const fecha = new Date(fechaHora);
    return fecha.toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'agendada':
        return 'bg-blue-100 text-blue-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Barra superior */}
      <div className="flex items-center gap-3 px-8 py-6 border-b shadow-sm">
        <Calendar className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Mis Citas</h2>
      </div>

      {/* Subtítulo */}
      <div className="px-8 py-2 text-slate-500 border-b">
        Gestiona las citas de tus pacientes y actualiza el estado de cada consulta.
      </div>

      {/* Controles */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-4 px-8 py-6">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
          <input
            className="pl-10 pr-4 py-2 border rounded-lg w-full text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Buscar por paciente..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
            className="px-4 py-2 border rounded-lg text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="todas">Todas las citas</option>
            <option value="agendada">Agendadas</option>
            <option value="completada">Completadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 px-8 pb-6">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Cargando citas...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">Error: {error}</p>
            <button 
              onClick={cargarCitas}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {citasFiltradas.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">No hay citas para mostrar</p>
                <p className="text-slate-400">
                  {search ? 'Intenta con otro término de búsqueda' : 'Las citas aparecerán aquí cuando sean agendadas'}
                </p>
              </div>
            )}
            
            {citasFiltradas.map(cita => (
              <div key={cita.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                {/* Header de la tarjeta */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">
                      {cita.paciente?.usuario?.nombre} {cita.paciente?.usuario?.apellido}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(cita.estado)}`}>
                    {cita.estado || 'agendada'}
                  </span>
                </div>

                {/* Información de la cita */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatearFecha(cita.fecha_hora)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{formatearHora(cita.fecha_hora)}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Tipo:</strong> {cita.tipo || 'Consulta general'}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Motivo:</strong> {cita.motivo || 'No especificado'}
                  </div>
                  {cita.observaciones && (
                    <div className="text-sm text-gray-600">
                      <strong>Observaciones:</strong> {cita.observaciones}
                    </div>
                  )}
                </div>

                {/* Acciones */}
                {cita.estado === 'agendada' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => cambiarEstadoCita(cita.id, 'completada')}
                      className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex-1 justify-center"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Completar
                    </button>
                    <button 
                      onClick={() => cambiarEstadoCita(cita.id, 'cancelada')}
                      className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm flex-1 justify-center"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </div>
                )}

                {cita.estado === 'completada' && (
                  <div className="text-center text-sm text-green-600 font-medium">
                    ✓ Cita completada
                  </div>
                )}

                {cita.estado === 'cancelada' && (
                  <div className="text-center text-sm text-red-600 font-medium">
                    ✗ Cita cancelada
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}