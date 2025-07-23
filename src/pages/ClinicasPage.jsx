import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, MapPin, Phone, Clock, Users } from 'lucide-react';

export default function ClinicasPage() {
  const [clinicas, setClinicas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedClinica, setSelectedClinica] = useState(null);

  useEffect(() => {
    fetchClinicas();
  }, []);

  const fetchClinicas = async () => {
    try {
      setLoading(true);
      // Aquí iría la llamada a la API
      // const response = await fetch('/api/clinicas');
      // const data = await response.json();
      
      // Datos de ejemplo
      const mockData = [
        {
          id: 1,
          nombre: 'PhisyoMar Centro',
          direccion: 'Av. Revolución 1234, Col. Centro, CDMX',
          telefono: '555-0100',
          email: 'centro@phisyomar.com',
          horario_apertura: '08:00',
          horario_cierre: '20:00',
          capacidad: 50,
          especialidades: ['Fisioterapia', 'Rehabilitación', 'Terapia Deportiva'],
          status: 'Activo',
          fecha_apertura: '2020-01-15'
        },
        {
          id: 2,
          nombre: 'PhisyoMar Norte',
          direccion: 'Av. Insurgentes Norte 5678, Col. Lindavista, CDMX',
          telefono: '555-0200',
          email: 'norte@phisyomar.com',
          horario_apertura: '07:00',
          horario_cierre: '19:00',
          capacidad: 35,
          especialidades: ['Fisioterapia', 'Masoterapia'],
          status: 'Activo',
          fecha_apertura: '2021-03-20'
        },
        {
          id: 3,
          nombre: 'PhisyoMar Sur',
          direccion: 'Calz. de Tlalpan 9101, Col. Portales, CDMX',
          telefono: '555-0300',
          email: 'sur@phisyomar.com',
          horario_apertura: '09:00',
          horario_cierre: '18:00',
          capacidad: 25,
          especialidades: ['Fisioterapia', 'Rehabilitación Neurológica'],
          status: 'Mantenimiento',
          fecha_apertura: '2022-06-10'
        }
      ];
      
      setClinicas(mockData);
    } catch (error) {
      console.error('Error al cargar clínicas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClinicas = clinicas.filter(clinica =>
    clinica.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinica.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinica.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (clinica) => {
    setSelectedClinica(clinica);
    setShowModal(true);
  };

  const handleView = (clinica) => {
    setSelectedClinica(clinica);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Clínicas</h1>
        <p className="text-gray-600">Gestiona las sedes y sucursales de PhisyoMar</p>
      </div>

      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar clínicas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => {
            setSelectedClinica(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Clínica
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clínicas</p>
              <p className="text-2xl font-bold text-gray-900">{clinicas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Capacidad Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {clinicas.reduce((sum, clinica) => sum + clinica.capacidad, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {clinicas.filter(c => c.status === 'Activo').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Mantenimiento</p>
              <p className="text-2xl font-bold text-gray-900">
                {clinicas.filter(c => c.status === 'Mantenimiento').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de clínicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClinicas.map((clinica) => (
          <div key={clinica.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              {/* Header de la tarjeta */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{clinica.nombre}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      clinica.status === 'Activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {clinica.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleView(clinica)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(clinica)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Información de contacto */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="line-clamp-2">{clinica.direccion}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{clinica.telefono}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400 mr-2" />
                  <span>{clinica.horario_apertura} - {clinica.horario_cierre}</span>
                </div>
              </div>

              {/* Especialidades */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Especialidades:</p>
                <div className="flex flex-wrap gap-1">
                  {clinica.especialidades.map((especialidad, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {especialidad}
                    </span>
                  ))}
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{clinica.capacidad}</p>
                  <p className="text-xs text-gray-500">Capacidad</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {new Date().getFullYear() - new Date(clinica.fecha_apertura).getFullYear()}
                  </p>
                  <p className="text-xs text-gray-500">Años Activa</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredClinicas.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clínicas</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza agregando una nueva clínica al sistema.
          </p>
        </div>
      )}
    </div>
  );
}