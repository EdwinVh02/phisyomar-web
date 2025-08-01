import { Calendar, Search, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getCitas, createCita, updateCita, deleteCita } from "../services/citaService";
import CitaForm from "../components/CitaForm";
import { useToast } from "../hooks/useToast";

export default function Citas() {
  const [search, setSearch] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useToast();

  // Cargar citas al montar el componente
  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCitas();
      setCitas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const citasFiltradas = citas.filter(cita => {
    const nombrePaciente = cita.paciente?.usuario?.nombre || cita.paciente_nombre || '';
    return nombrePaciente.toLowerCase().includes(search.toLowerCase());
  });

  async function handleAgregarCita(nuevaCita) {
    try {
      const citaCreada = await createCita(nuevaCita);
      setCitas(prev => [...prev, citaCreada]);
      setMostrarFormulario(false);
      showSuccess('Cita creada exitosamente');
    } catch (error) {
      showError('Error al crear la cita: ' + error.message);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Barra superior */}
      <div className="flex items-center gap-3 px-8 py-6 border-b shadow-sm">
        <Calendar className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-slate-900">Gestión de Citas</h2>
      </div>

      {/* Subtítulo */}
      <div className="px-8 py-2 text-slate-500 border-b">
        Administra, consulta y agenda citas de manera sencilla y rápida.
      </div>

      {/* Controles y tabla */}
      <div className="flex-1 flex flex-col gap-4 px-8 py-6 w-full">
        {/* Controles */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-4">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input
              className="pl-10 pr-4 py-2 border rounded-lg w-full text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Buscar por paciente..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition w-full md:w-auto justify-center"
            onClick={() => setMostrarFormulario(true)}
          >
            <PlusCircle className="w-5 h-5" /> Nueva cita
          </button>
        </div>

        {/* Tabla de citas */}
        <div className="overflow-x-auto flex-1">
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
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="py-2 px-4">Paciente</th>
                  <th className="py-2 px-4">Fecha</th>
                  <th className="py-2 px-4">Hora</th>
                  <th className="py-2 px-4">Estado</th>
                  <th className="py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {citasFiltradas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-slate-400">
                      No hay citas para mostrar.
                    </td>
                  </tr>
                )}
                {citasFiltradas.map(cita => (
                  <tr key={cita.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">
                      {cita.paciente?.usuario?.nombre} {cita.paciente?.usuario?.apellido_paterno || ''}
                    </td>
                    <td className="py-2 px-4">{cita.fecha}</td>
                    <td className="py-2 px-4">{cita.hora}</td>
                    <td className="py-2 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        cita.estado === 'programada' ? 'bg-green-100 text-green-800' :
                        cita.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                        cita.estado === 'completada' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {cita.estado || 'Programada'}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <button className="text-blue-600 hover:underline text-sm mr-2">Editar</button>
                      <button className="text-red-600 hover:underline text-sm">Cancelar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Formulario de nueva cita (reutilizable) */}
        {mostrarFormulario && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-sm w-full flex flex-col gap-4">
              <CitaForm
                onClose={() => setMostrarFormulario(false)}
                onSubmit={handleAgregarCita}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
