import React, { useEffect, useState } from 'react';
import { Calendar, Users, Clock, UserPlus } from 'lucide-react';
import { getCitas, getPacientes } from '../services';

export default function RecepcionistaHomePage() {
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [citasData, pacientesData] = await Promise.all([
        getCitas(),
        getPacientes()
      ]);
      setCitas(citasData || []);
      setPacientes(pacientesData || []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const citasHoy = citas.filter(cita => {
    const fechaCita = new Date(cita.fecha);
    const hoy = new Date();
    return fechaCita.toDateString() === hoy.toDateString();
  });

  const citasPendientes = citas.filter(cita => cita.estado === 'programada');

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Recepción</h1>
        <p className="text-gray-600">Gestiona citas y pacientes de la clínica</p>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Citas Hoy</p>
              <p className="text-3xl font-bold text-gray-900">{citasHoy.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Pacientes</p>
              <p className="text-3xl font-bold text-gray-900">{pacientes.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Citas Pendientes</p>
              <p className="text-3xl font-bold text-gray-900">{citasPendientes.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Nuevos Esta Semana</p>
              <p className="text-3xl font-bold text-gray-900">5</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Citas de hoy y Tareas pendientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Citas de Hoy</h3>
          <div className="space-y-3">
            {citasHoy.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay citas programadas para hoy</p>
            ) : (
              citasHoy.map(cita => (
                <div key={cita.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {cita.paciente?.usuario?.nombre} {cita.paciente?.usuario?.apellido_paterno}
                    </p>
                    <p className="text-sm text-gray-600">
                      Dr. {cita.terapeuta?.usuario?.nombre} {cita.terapeuta?.usuario?.apellido_paterno}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">{cita.hora}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      cita.estado === 'programada' ? 'bg-green-100 text-green-800' :
                      cita.estado === 'completada' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {cita.estado || 'Programada'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pacientes Recientes</h3>
          <div className="space-y-3">
            {pacientes.slice(0, 5).map(paciente => (
              <div key={paciente.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {paciente.usuario?.nombre?.charAt(0)?.toUpperCase() || 'P'}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {paciente.usuario?.nombre} {paciente.usuario?.apellido_paterno}
                  </p>
                  <p className="text-sm text-gray-600">{paciente.usuario?.correo_electronico}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Reg: {new Date(paciente.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {pacientes.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay pacientes registrados</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}