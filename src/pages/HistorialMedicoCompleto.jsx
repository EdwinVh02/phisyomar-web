import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Edit, 
  Eye, 
  User,
  Calendar,
  Clock,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { 
  getHistoriales, 
  getMisPacientes,
  createHistorialTerapeuta,
  updateHistorialTerapeuta,
  getHistorialById
} from '../services/historialService';
import HistorialMedicoForm from '../components/HistorialMedicoForm';

export default function HistorialMedicoCompleto() {
  const [historiales, setHistoriales] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [selectedHistorial, setSelectedHistorial] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create', 'edit', 'view'
  const [error, setError] = useState(null);
  
  const { user } = useAuthStore();
  const esTerapeuta = user?.rol_id === 2;
  const esAdmin = user?.rol_id === 1;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (esTerapeuta) {
        // Para terapeutas, obtener sus pacientes
        const pacientesData = await getMisPacientes();
        setPacientes(pacientesData);
      } else if (esAdmin) {
        // Para admin, obtener todos los historiales
        const historialesData = await getHistoriales();
        setHistoriales(historialesData);
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHistorial = (paciente) => {
    setSelectedPaciente(paciente);
    setSelectedHistorial(null);
    setFormMode('create');
    setShowForm(true);
  };

  const handleEditHistorial = async (historial) => {
    try {
      const historialCompleto = await getHistorialById(historial.id);
      setSelectedHistorial(historialCompleto);
      setSelectedPaciente(historial.paciente || historial.paciente_info);
      setFormMode('edit');
      setShowForm(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewHistorial = async (historial) => {
    try {
      const historialCompleto = await getHistorialById(historial.id);
      setSelectedHistorial(historialCompleto);
      setSelectedPaciente(historial.paciente || historial.paciente_info);
      setFormMode('view');
      setShowForm(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSaveHistorial = async (historialData) => {
    try {
      if (formMode === 'create') {
        await createHistorialTerapeuta(selectedPaciente.id, historialData);
      } else if (formMode === 'edit') {
        await updateHistorialTerapeuta(selectedPaciente.id, historialData);
      }
      
      setShowForm(false);
      await fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredPacientes = pacientes.filter(paciente =>
    paciente.usuario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.usuario?.apellido_paterno?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.usuario?.correo_electronico?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistoriales = historiales.filter(historial =>
    historial.paciente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    historial.motivo_consulta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    historial.diagnostico_fisioterapeutico?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando historiales médicos...</p>
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HistorialMedicoForm
            paciente={selectedPaciente}
            historialExistente={selectedHistorial}
            onSave={handleSaveHistorial}
            onCancel={() => setShowForm(false)}
            esEdicion={formMode === 'edit'}
            esVisualizacion={formMode === 'view'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {esTerapeuta ? 'Mis Pacientes - Historiales Médicos' : 'Gestión de Historiales Médicos'}
        </h1>
        <p className="text-gray-600">
          {esTerapeuta 
            ? 'Crea y gestiona los historiales médicos de tus pacientes'
            : 'Administra todos los historiales médicos del sistema'
          }
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={esTerapeuta ? "Buscar paciente..." : "Buscar por paciente, diagnóstico..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {esTerapeuta ? 'Mis Pacientes' : 'Total Historiales'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {esTerapeuta ? pacientes.length : historiales.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                {esTerapeuta ? 'Con Historial' : 'Pacientes Activos'}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {esTerapeuta 
                  ? pacientes.filter(p => p.historial_medico).length
                  : historiales.filter(h => h.estado === 'Activo').length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Esta Semana</p>
              <p className="text-2xl font-bold text-gray-900">
                {esTerapeuta 
                  ? pacientes.filter(p => {
                      const lastUpdate = new Date(p.historial_medico?.updated_at);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return lastUpdate > weekAgo;
                    }).length
                  : 0
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {esTerapeuta ? (
          // Vista para terapeutas - Lista de pacientes
          <div className="divide-y divide-gray-200">
            {filteredPacientes.length === 0 ? (
              <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay pacientes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {pacientes.length === 0 
                    ? 'Aún no tienes pacientes asignados.'
                    : 'No se encontraron pacientes que coincidan con la búsqueda.'
                  }
                </p>
              </div>
            ) : (
              filteredPacientes.map((paciente) => (
                <div key={paciente.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {paciente.usuario?.nombre?.charAt(0)}{paciente.usuario?.apellido_paterno?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {paciente.usuario?.nombre} {paciente.usuario?.apellido_paterno}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{paciente.usuario?.correo_electronico}</span>
                            <span>•</span>
                            <span>{paciente.usuario?.telefono}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Estado del Historial:</p>
                          <p className="text-sm text-gray-600">
                            {paciente.historial_medico ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                                Completo
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1"></div>
                                Pendiente
                              </span>
                            )}
                          </p>
                        </div>
                        {paciente.historial_medico && (
                          <div>
                            <p className="text-sm font-medium text-gray-700">Última Actualización:</p>
                            <p className="text-sm text-gray-600">
                              {new Date(paciente.historial_medico.updated_at).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      {paciente.historial_medico ? (
                        <>
                          <button
                            onClick={() => handleViewHistorial({
                              id: paciente.historial_medico.id,
                              paciente: paciente.usuario
                            })}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Ver Historial
                          </button>
                          <button
                            onClick={() => handleEditHistorial({
                              id: paciente.historial_medico.id,
                              paciente: paciente.usuario
                            })}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Editar
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleCreateHistorial(paciente.usuario)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Crear Historial
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Vista para admin - Lista de historiales
          <div className="divide-y divide-gray-200">
            {filteredHistoriales.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay historiales</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No se encontraron historiales que coincidan con la búsqueda.
                </p>
              </div>
            ) : (
              filteredHistoriales.map((historial) => (
                <div key={historial.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {historial.paciente?.nombre?.charAt(0)}{historial.paciente?.apellido_paterno?.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {historial.paciente?.nombre} {historial.paciente?.apellido_paterno}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Creado: {new Date(historial.fecha_creacion).toLocaleDateString('es-ES')}</span>
                            <span>•</span>
                            <span>Actualizado: {new Date(historial.updated_at).toLocaleDateString('es-ES')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Motivo de Consulta:</p>
                          <p className="text-sm text-gray-600">{historial.motivo_consulta}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Diagnóstico:</p>
                          <p className="text-sm text-gray-600">{historial.diagnostico_fisioterapeutico}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <button
                        onClick={() => handleViewHistorial(historial)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Completo
                      </button>
                      <button
                        onClick={() => handleEditHistorial(historial)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}