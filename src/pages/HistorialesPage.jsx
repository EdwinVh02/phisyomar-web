import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, FileText, User, Calendar, Download } from 'lucide-react';

export default function HistorialesPage() {
  const [historiales, setHistoriales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHistorial, setSelectedHistorial] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchHistoriales();
  }, []);

  const fetchHistoriales = async () => {
    try {
      setLoading(true);
      
      // Datos de ejemplo
      const mockData = [
        {
          id: 1,
          paciente: {
            nombre: 'Juan Pérez García',
            edad: 35,
            telefono: '555-0101'
          },
          fecha_creacion: '2025-01-10',
          ultima_actualizacion: '2025-01-15',
          motivo_consulta: 'Dolor de espalda baja crónico',
          diagnostico_fisioterapeutico: 'Lumbalgia mecánica con contractura muscular',
          terapeuta: 'Dr. Carlos López',
          sesiones_completadas: 8,
          sesiones_programadas: 12,
          alergias: 'Ninguna conocida',
          medicamentos_actuales: 'Ibuprofeno 400mg cada 8 horas',
          estado: 'Activo'
        },
        {
          id: 2,
          paciente: {
            nombre: 'María González',
            edad: 42,
            telefono: '555-0102'
          },
          fecha_creacion: '2025-01-05',
          ultima_actualizacion: '2025-01-14',
          motivo_consulta: 'Rehabilitación post-cirugía de rodilla',
          diagnostico_fisioterapeutico: 'Post-quirúrgico de meniscectomía, limitación de rango articular',
          terapeuta: 'Dra. Ana Martínez',
          sesiones_completadas: 15,
          sesiones_programadas: 20,
          alergias: 'Penicilina',
          medicamentos_actuales: 'Paracetamol 500mg según necesidad',
          estado: 'Activo'
        },
        {
          id: 3,
          paciente: {
            nombre: 'Roberto Silva',
            edad: 28,
            telefono: '555-0103'
          },
          fecha_creacion: '2024-12-20',
          ultima_actualizacion: '2025-01-12',
          motivo_consulta: 'Lesión deportiva en hombro',
          diagnostico_fisioterapeutico: 'Tendinitis del supraespinoso, fase subaguda',
          terapeuta: 'Dr. Luis Hernández',
          sesiones_completadas: 10,
          sesiones_programadas: 10,
          alergias: 'Ninguna',
          medicamentos_actuales: 'Ninguno',
          estado: 'Completado'
        }
      ];
      
      setHistoriales(mockData);
    } catch (error) {
      console.error('Error al cargar historiales:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistoriales = historiales.filter(historial =>
    historial.paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    historial.motivo_consulta.toLowerCase().includes(searchTerm.toLowerCase()) ||
    historial.diagnostico_fisioterapeutico.toLowerCase().includes(searchTerm.toLowerCase()) ||
    historial.terapeuta.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewHistorial = (historial) => {
    setSelectedHistorial(historial);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Historiales Médicos</h1>
        <p className="text-gray-600">Consulta y gestiona los historiales clínicos de fisioterapia</p>
      </div>

      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por paciente, diagnóstico o terapeuta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Historiales</p>
              <p className="text-2xl font-bold text-gray-900">{historiales.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pacientes Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {historiales.filter(h => h.estado === 'Activo').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tratamientos Completados</p>
              <p className="text-2xl font-bold text-gray-900">
                {historiales.filter(h => h.estado === 'Completado').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio Sesiones</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(historiales.reduce((acc, h) => acc + h.sesiones_completadas, 0) / historiales.length)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de historiales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {filteredHistoriales.map((historial) => (
            <div key={historial.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {historial.paciente.nombre.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{historial.paciente.nombre}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{historial.paciente.edad} años</span>
                        <span>•</span>
                        <span>{historial.paciente.telefono}</span>
                        <span>•</span>
                        <span>Terapeuta: {historial.terapeuta}</span>
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

                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Sesiones: {historial.sesiones_completadas}/{historial.sesiones_programadas}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        historial.estado === 'Activo' ? 'bg-green-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="text-sm text-gray-600">Estado: {historial.estado}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Última actualización: {new Date(historial.ultima_actualizacion).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Progreso de sesiones */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progreso del tratamiento</span>
                      <span className="text-sm text-gray-600">
                        {Math.round((historial.sesiones_completadas / historial.sesiones_programadas) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min((historial.sesiones_completadas / historial.sesiones_programadas) * 100, 100)}%` 
                        }}
                      ></div>
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
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredHistoriales.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay historiales</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron historiales que coincidan con la búsqueda.
            </p>
          </div>
        )}
      </div>

      {/* Modal para ver historial completo */}
      {showModal && selectedHistorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Historial Médico Completo</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Información del paciente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Datos del Paciente</h3>
                  <div className="space-y-2">
                    <p><strong>Nombre:</strong> {selectedHistorial.paciente.nombre}</p>
                    <p><strong>Edad:</strong> {selectedHistorial.paciente.edad} años</p>
                    <p><strong>Teléfono:</strong> {selectedHistorial.paciente.telefono}</p>
                    <p><strong>Alergias:</strong> {selectedHistorial.alergias}</p>
                    <p><strong>Medicamentos:</strong> {selectedHistorial.medicamentos_actuales}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Información del Tratamiento</h3>
                  <div className="space-y-2">
                    <p><strong>Terapeuta:</strong> {selectedHistorial.terapeuta}</p>
                    <p><strong>Fecha de creación:</strong> {new Date(selectedHistorial.fecha_creacion).toLocaleDateString()}</p>
                    <p><strong>Última actualización:</strong> {new Date(selectedHistorial.ultima_actualizacion).toLocaleDateString()}</p>
                    <p><strong>Estado:</strong> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        selectedHistorial.estado === 'Activo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedHistorial.estado}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Evaluación clínica */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Evaluación Clínica</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Motivo de Consulta:</h4>
                    <p className="text-gray-600">{selectedHistorial.motivo_consulta}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Diagnóstico Fisioterapéutico:</h4>
                    <p className="text-gray-600">{selectedHistorial.diagnostico_fisioterapeutico}</p>
                  </div>
                </div>
              </div>

              {/* Progreso del tratamiento */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Progreso del Tratamiento</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span>Sesiones completadas: {selectedHistorial.sesiones_completadas} de {selectedHistorial.sesiones_programadas}</span>
                    <span className="font-semibold">
                      {Math.round((selectedHistorial.sesiones_completadas / selectedHistorial.sesiones_programadas) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full" 
                      style={{ 
                        width: `${Math.min((selectedHistorial.sesiones_completadas / selectedHistorial.sesiones_programadas) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}