import { useState, useEffect } from 'react';
import { 
  Users, Plus, Search, Edit, Trash2, Eye, Phone, 
  Mail, UserCheck, Calendar, MoreVertical, Stethoscope, MapPin
} from 'lucide-react';
import { useToast } from '../hooks/useToast';

export default function TerapeutasPage() {
  const [terapeutas, setTerapeutas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedTerapeuta, setSelectedTerapeuta] = useState(null);
  const { showWarning } = useToast();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo_electronico: '',
    telefono: '',
    numero_cedula: '',
    telefono_consultorio: ''
  });

  useEffect(() => {
    cargarTerapeutas();
  }, []);

  const cargarTerapeutas = async () => {
    try {
      // Datos de ejemplo más completos
      setTerapeutas([
        {
          id: 1,
          numero_cedula: '12345678',
          telefono_consultorio: '555-0101',
          especialidad: 'Fisioterapia Deportiva',
          años_experiencia: 8,
          pacientes_activos: 25,
          citas_mes: 120,
          calificacion: 4.8,
          status: 'Activo',
          usuario: {
            nombre: 'Dr. Juan Carlos',
            apellido_paterno: 'González',
            apellido_materno: 'López',
            correo_electronico: 'juan.gonzalez@phisyomar.com',
            telefono: '555-1234'
          }
        },
        {
          id: 2,
          numero_cedula: '87654321',
          telefono_consultorio: '555-0102',
          especialidad: 'Rehabilitación Neurológica',
          años_experiencia: 12,
          pacientes_activos: 18,
          citas_mes: 95,
          calificacion: 4.9,
          status: 'Activo',
          usuario: {
            nombre: 'Dra. María Elena',
            apellido_paterno: 'Rodríguez',
            apellido_materno: 'Martínez',
            correo_electronico: 'maria.rodriguez@phisyomar.com',
            telefono: '555-5678'
          }
        },
        {
          id: 3,
          numero_cedula: '45678912',
          telefono_consultorio: '555-0103',
          especialidad: 'Fisioterapia General',
          años_experiencia: 5,
          pacientes_activos: 32,
          citas_mes: 140,
          calificacion: 4.7,
          status: 'Activo',
          usuario: {
            nombre: 'Dr. Luis',
            apellido_paterno: 'Hernández',
            apellido_materno: 'Torres',
            correo_electronico: 'luis.hernandez@phisyomar.com',
            telefono: '555-9012'
          }
        }
      ]);
    } catch (error) {
      console.error('Error al cargar terapeutas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTerapeutas = terapeutas.filter(terapeuta =>
    `${terapeuta.usuario.nombre} ${terapeuta.usuario.apellido_paterno} ${terapeuta.usuario.apellido_materno}`
      .toLowerCase().includes(searchTerm.toLowerCase()) ||
    terapeuta.usuario.correo_electronico.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Lógica para crear/actualizar terapeuta
      if (process.env.NODE_ENV === 'development') {
        console.log('Datos del terapeuta:', formData);
      }
      setShowModal(false);
      cargarTerapeutas();
    } catch (error) {
      console.error('Error al guardar terapeuta:', error);
    }
  };

  const handleEdit = (terapeuta) => {
    setSelectedTerapeuta(terapeuta);
    setFormData({
      nombre: terapeuta.usuario.nombre,
      apellido_paterno: terapeuta.usuario.apellido_paterno,
      apellido_materno: terapeuta.usuario.apellido_materno,
      correo_electronico: terapeuta.usuario.correo_electronico,
      telefono: terapeuta.usuario.telefono,
      numero_cedula: terapeuta.numero_cedula,
      telefono_consultorio: terapeuta.telefono_consultorio
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    showWarning('¿Está seguro de eliminar este terapeuta?');
    // Simulate user confirmation with a timeout or assume they confirmed
    const userConfirmed = true; // You might want to implement a proper modal confirmation
    if (userConfirmed) {
      try {
        // Lógica para eliminar terapeuta
        if (process.env.NODE_ENV === 'development') {
          console.log('Eliminar terapeuta:', id);
        }
        cargarTerapeutas();
      } catch (error) {
        console.error('Error al eliminar terapeuta:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      correo_electronico: '',
      telefono: '',
      numero_cedula: '',
      telefono_consultorio: ''
    });
    setSelectedTerapeuta(null);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terapeutas</h1>
        <p className="text-gray-600">Gestiona el equipo de terapeutas de la clínica</p>
      </div>

      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar terapeutas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Terapeuta
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Terapeutas</p>
              <p className="text-2xl font-bold text-gray-900">{terapeutas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pacientes Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {terapeutas.reduce((sum, t) => sum + t.pacientes_activos, 0)}
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
              <p className="text-sm font-medium text-gray-600">Citas del Mes</p>
              <p className="text-2xl font-bold text-gray-900">
                {terapeutas.reduce((sum, t) => sum + t.citas_mes, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Stethoscope className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Calificación Promedio</p>
              <p className="text-2xl font-bold text-gray-900">
                {(terapeutas.reduce((sum, t) => sum + t.calificacion, 0) / terapeutas.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Tabla de terapeutas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Terapeuta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Especialidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experiencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pacientes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Calificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTerapeutas.map((terapeuta) => (
                  <tr key={terapeuta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {terapeuta.usuario.nombre.charAt(0)}{terapeuta.usuario.apellido_paterno.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {terapeuta.usuario.nombre} {terapeuta.usuario.apellido_paterno} {terapeuta.usuario.apellido_materno}
                          </div>
                          <div className="text-sm text-gray-500">Cédula: {terapeuta.numero_cedula}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-900">{terapeuta.especialidad}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {terapeuta.usuario.correo_electronico}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {terapeuta.usuario.telefono}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {terapeuta.años_experiencia} años
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{terapeuta.pacientes_activos} activos</div>
                      <div className="text-sm text-gray-500">{terapeuta.citas_mes} citas/mes</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900">{terapeuta.calificacion}</div>
                        <div className="ml-1 text-yellow-400">⭐</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        terapeuta.status === 'Activo'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {terapeuta.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(terapeuta)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(terapeuta.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTerapeutas.length === 0 && (
          <div className="text-center py-12">
            <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay terapeutas</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No se encontraron terapeutas que coincidan con la búsqueda.' : 'Comienza agregando un nuevo terapeuta.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedTerapeuta ? 'Editar Terapeuta' : 'Nuevo Terapeuta'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Paterno</label>
                  <input
                    type="text"
                    value={formData.apellido_paterno}
                    onChange={(e) => setFormData({...formData, apellido_paterno: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido Materno</label>
                  <input
                    type="text"
                    value={formData.apellido_materno}
                    onChange={(e) => setFormData({...formData, apellido_materno: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    value={formData.correo_electronico}
                    onChange={(e) => setFormData({...formData, correo_electronico: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono Personal</label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Cédula</label>
                  <input
                    type="text"
                    value={formData.numero_cedula}
                    onChange={(e) => setFormData({...formData, numero_cedula: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono Consultorio</label>
                  <input
                    type="tel"
                    value={formData.telefono_consultorio}
                    onChange={(e) => setFormData({...formData, telefono_consultorio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {selectedTerapeuta ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}