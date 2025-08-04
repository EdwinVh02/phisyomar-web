import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Phone, Mail, MapPin } from 'lucide-react';
import { getRecepcionistas, createRecepcionista, updateRecepcionista, deleteRecepcionista } from '../services/recepcionistaService';

export default function RecepcionistasPage() {
  const [recepcionistas, setRecepcionistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedRecepcionista, setSelectedRecepcionista] = useState(null);

  useEffect(() => {
    fetchRecepcionistas();
  }, []);

  const fetchRecepcionistas = async () => {
    try {
      setLoading(true);
      console.log('🔍 Cargando recepcionistas desde la base de datos...');
      const data = await getRecepcionistas();
      console.log('✅ Recepcionistas obtenidos:', data);
      
      // Asegurar que siempre sea un array
      const recepcionistasList = Array.isArray(data) ? data : (data?.data || []);
      setRecepcionistas(recepcionistasList);
      
    } catch (error) {
      console.error('❌ Error al cargar recepcionistas:', error);
      setRecepcionistas([]); // Array vacío si hay error
    } finally {
      setLoading(false);
    }
  };

  const filteredRecepcionistas = recepcionistas.filter(recepcionista => {
    if (!recepcionista) return false;
    
    const nombre = recepcionista.usuario ? 
      `${recepcionista.usuario.nombre || ''} ${recepcionista.usuario.apellido_paterno || ''} ${recepcionista.usuario.apellido_materno || ''}`
      : `${recepcionista.nombre || ''} ${recepcionista.apellido_paterno || ''} ${recepcionista.apellido_materno || ''}`;
    
    const email = recepcionista.usuario?.correo_electronico || recepcionista.email || '';
    
    return nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleEdit = (recepcionista) => {
    setSelectedRecepcionista(recepcionista);
    setShowModal(true);
  };

  const handleView = (recepcionista) => {
    setSelectedRecepcionista(recepcionista);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recepcionistas</h1>
        <p className="text-gray-600">Gestiona el personal de recepción de la clínica</p>
      </div>

      {/* Controles superiores */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar recepcionistas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => {
            setSelectedRecepcionista(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Recepcionista
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Recepcionistas</p>
              <p className="text-2xl font-bold text-gray-900">{recepcionistas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Turno Matutino</p>
              <p className="text-2xl font-bold text-gray-900">
                {recepcionistas.filter(r => r.turno === 'Matutino').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Turno Vespertino</p>
              <p className="text-2xl font-bold text-gray-900">
                {recepcionistas.filter(r => r.turno === 'Vespertino').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de recepcionistas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recepcionista
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Contratación
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
              {filteredRecepcionistas.map((recepcionista) => (
                <tr key={recepcionista.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {recepcionista.nombre.charAt(0)}{recepcionista.apellido_paterno.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {recepcionista.nombre} {recepcionista.apellido_paterno} {recepcionista.apellido_materno}
                        </div>
                        <div className="text-sm text-gray-500">ID: {recepcionista.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {recepcionista.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Phone className="w-4 h-4 text-gray-400" />
                      {recepcionista.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      recepcionista.turno === 'Matutino' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {recepcionista.turno}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(recepcionista.fecha_contratacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      recepcionista.status === 'Activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {recepcionista.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(recepcionista)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(recepcionista)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecepcionistas.length === 0 && (
          <div className="text-center py-12">
            <Phone className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay recepcionistas</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza agregando un nuevo recepcionista al sistema.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}