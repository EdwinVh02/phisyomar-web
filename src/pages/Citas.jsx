import { Calendar, Search, PlusCircle } from "lucide-react";
import { useState } from "react";
import CitaForm from "../components/CitaForm"; // Ajusta la ruta según tu estructura

const citasMock = [
  { id: 1, paciente: "Juan Pérez", fecha: "2025-07-08", hora: "10:00 AM" },
  { id: 2, paciente: "Ana López", fecha: "2025-07-08", hora: "12:30 PM" },
  { id: 3, paciente: "Carlos Díaz", fecha: "2025-07-09", hora: "09:00 AM" },
];

export default function Citas() {
  const [search, setSearch] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [citas, setCitas] = useState(citasMock);

  const citasFiltradas = citas.filter(cita =>
    cita.paciente.toLowerCase().includes(search.toLowerCase())
  );

  function handleAgregarCita(nuevaCita) {
    setCitas([
      ...citas,
      {
        ...nuevaCita,
        id: citas.length + 1,
        hora: nuevaCita.hora // Puedes formatear la hora si lo necesitas
      }
    ]);
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
          <table className="w-full text-left border">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="py-2 px-4">Paciente</th>
                <th className="py-2 px-4">Fecha</th>
                <th className="py-2 px-4">Hora</th>
                <th className="py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-slate-400">
                    No hay citas para mostrar.
                  </td>
                </tr>
              )}
              {citasFiltradas.map(cita => (
                <tr key={cita.id} className="border-t">
                  <td className="py-2 px-4">{cita.paciente}</td>
                  <td className="py-2 px-4">{cita.fecha}</td>
                  <td className="py-2 px-4">{cita.hora}</td>
                  <td className="py-2 px-4">
                    <button className="text-blue-600 hover:underline text-sm">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
