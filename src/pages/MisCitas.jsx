import React from "react";
import { useNavigate } from "react-router-dom";
import CitasTabla from "../components/CitasTabla";
import { useCitas } from "../hooks/useCitas";
import { Calendar, Plus, Heart, Clock, AlertCircle } from "lucide-react";
import { useToast } from "../hooks/useToast";

export default function MisCitasPage() {
  const { citas, loading, error, cancelar } = useCitas();
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning } = useToast();

  // Lógica para cancelar cita
  async function handleCancelarCita(cita) {
    showWarning("¿Seguro que deseas cancelar esta cita?");
    // Simulate user confirmation with a timeout or assume they confirmed
    const userConfirmed = true; // You might want to implement a proper modal confirmation
    if (userConfirmed) {
      try {
        await cancelar(cita.id);
        showSuccess("Cita cancelada exitosamente");
      } catch (error) {
        showError("Error al cancelar la cita: " + error.message);
      }
    }
  }

  // Lógica para ver detalle
  function handleVerDetalle(cita) {
    navigate(`/paciente/cita/${cita.id}`);
  }

  // Estadísticas de citas
  const citasAgendadas = citas.filter(cita => cita.estado === 'agendada').length;
  const citasAtendidas = citas.filter(cita => cita.estado === 'atendida').length;
  const citasCanceladas = citas.filter(cita => cita.estado === 'cancelada').length;

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando tus citas...</p>
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
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-600 text-lg font-medium">Error al cargar las citas</p>
            <p className="text-gray-600 mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Citas</h1>
        <p className="text-gray-600">Consulta y gestiona tus citas médicas</p>
      </div>

      {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Citas Agendadas</p>
                <p className="text-3xl font-bold text-blue-600">{citasAgendadas}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Citas Atendidas</p>
                <p className="text-3xl font-bold text-green-600">{citasAtendidas}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Citas Canceladas</p>
                <p className="text-3xl font-bold text-red-600">{citasCanceladas}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Botón para nueva cita */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Historial de Citas</h2>
            <p className="text-gray-600 mt-1">
              {citas.length > 0 ? `${citas.length} citas en total` : 'No tienes citas registradas'}
            </p>
          </div>
          <button
            onClick={() => navigate('/paciente/agendar-cita')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Nueva Cita
          </button>
        </div>

        {/* Tabla de citas */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <CitasTabla
            citas={citas}
            onCancelar={handleCancelarCita}
            onVerDetalle={handleVerDetalle}
          />
        </div>
    </div>
  );
}
