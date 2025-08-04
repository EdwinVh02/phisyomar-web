import { useState, useEffect } from 'react';
import { Search, Filter, Clock, User, Activity, Eye, Download, Calendar } from 'lucide-react';
import bitacoraService from '../services/bitacoraService'; // Asegúrate de importar el servicio

export default function BitacorasPage() {
  const [bitacoras, setBitacoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState('todos');
  const [fechaFilter, setFechaFilter] = useState('');

  useEffect(() => {
    fetchBitacoras();
  }, []);

  const fetchBitacoras = async () => {
    try {
      setLoading(true);
      const response = await bitacoraService.getAll();
      console.log('Bitácoras desde la base de datos:', response); // <-- Aquí el console.log
      if (response.success) {
        setBitacoras(response.data || []);
      } else {
        setBitacoras([]);
      }
    } catch (error) {
      console.error('Error al cargar bitácoras:', error);
      setBitacoras([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBitacoras = bitacoras.filter(bitacora => {
    const matchesSearch = 
      (bitacora.usuario || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bitacora.accion || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bitacora.detalles || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bitacora.ip_address || '').includes(searchTerm);
    
    const matchesTipo = tipoFilter === 'todos' || (bitacora.tipo || '').toLowerCase() === tipoFilter.toLowerCase();
    
    const matchesFecha = !fechaFilter || (bitacora.timestamp || '').startsWith(fechaFilter);
    
    return matchesSearch && matchesTipo && matchesFecha;
  });

  const getTipoColor = (tipo) => {
    const colors = {
      'LOGIN': 'bg-green-100 text-green-800',
      'LOGOUT': 'bg-blue-100 text-blue-800',
      'CRUD': 'bg-purple-100 text-purple-800',
      'CITA': 'bg-yellow-100 text-yellow-800',
      'PAGO': 'bg-emerald-100 text-emerald-800',
      'ERROR': 'bg-red-100 text-red-800',
      'BACKUP': 'bg-gray-100 text-gray-800',
      'SECURITY': 'bg-orange-100 text-orange-800'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800';
  };

  const getNivelColor = (nivel) => {
    const colors = {
      'INFO': 'text-blue-600',
      'WARNING': 'text-yellow-600',
      'ERROR': 'text-red-600'
    };
    return colors[nivel] || 'text-gray-600';
  };

  const getNivelIcon = (nivel) => {
    switch (nivel) {
      case 'ERROR':
        return '🔴';
      case 'WARNING':
        return '⚠️';
      default:
        return 'ℹ️';
    }
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bitácoras del Sistema</h1>
        <p className="text-gray-600">Monitorea la actividad y eventos del sistema</p>
      </div>

      {/* Controles superiores */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por usuario, acción, IP o detalles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="todos">Todos los tipos</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="crud">CRUD</option>
            <option value="cita">Citas</option>
            <option value="pago">Pagos</option>
            <option value="error">Errores</option>
            <option value="backup">Backups</option>
            <option value="security">Seguridad</option>
          </select>
          <input
            type="date"
            value={fechaFilter}
            onChange={(e) => setFechaFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
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
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Registros</p>
              <p className="text-2xl font-bold text-gray-900">{bitacoras.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuarios Únicos</p>
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(bitacoras.map(b => b.usuario))].length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Errores</p>
              <p className="text-2xl font-bold text-gray-900">
                {bitacoras.filter(b => b.nivel === 'ERROR').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Eye className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Advertencias</p>
              <p className="text-2xl font-bold text-gray-900">
                {bitacoras.filter(b => b.nivel === 'WARNING').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de bitácoras */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nivel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBitacoras.map((bitacora) => (
                <tr key={bitacora.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getNivelIcon(bitacora.nivel)}</span>
                      <span className={`text-sm font-medium ${getNivelColor(bitacora.nivel)}`}>
                        {bitacora.nivel}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoColor(bitacora.tipo)}`}>
                      {bitacora.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {bitacora.usuario.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {bitacora.usuario === 'sistema' ? 'Sistema' : bitacora.usuario}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {bitacora.accion}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-md truncate" title={bitacora.detalles}>
                      {bitacora.detalles}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono">
                      {bitacora.ip_address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(bitacora.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBitacoras.length === 0 && (
          <div className="text-center py-12">
            <Activity className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay registros</h3>
            <p className="mt-1 text-sm text-gray-500">
              No se encontraron registros que coincidan con los filtros aplicados.
            </p>
          </div>
        )}
      </div>

      {/* Resumen de actividad reciente */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Actividad Reciente</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Clock className="mx-auto h-8 w-8 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {bitacoras.filter(b => 
                new Date(b.timestamp).toDateString() === new Date().toDateString()
              ).length}
            </p>
            <p className="text-sm text-gray-600">Eventos hoy</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <User className="mx-auto h-8 w-8 text-green-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {bitacoras.filter(b => 
                b.tipo === 'LOGIN' && 
                new Date(b.timestamp).toDateString() === new Date().toDateString()
              ).length}
            </p>
            <p className="text-sm text-gray-600">Inicios de sesión hoy</p>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Activity className="mx-auto h-8 w-8 text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {[...new Set(bitacoras
                .filter(b => new Date(b.timestamp).toDateString() === new Date().toDateString())
                .map(b => b.usuario)
              )].length}
            </p>
            <p className="text-sm text-gray-600">Usuarios activos hoy</p>
          </div>
        </div>
      </div>
    </div>
  );
}