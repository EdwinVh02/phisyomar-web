import { useState, useEffect } from 'react';
import { Database, Server, HardDrive, Activity, RefreshCw, Download, Upload, Settings } from 'lucide-react';
import { databaseService } from '../services';

export default function DatabasePage() {
  const [loading, setLoading] = useState(true);
  const [dbStats, setDbStats] = useState({});
  const [backupHistory, setBackupHistory] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connected');

  useEffect(() => {
    fetchDatabaseStats();
    fetchBackupHistory();
  }, []);

  const fetchDatabaseStats = async () => {
    try {
      setLoading(true);
      
      // Obtener datos reales del backend
      const response = await databaseService.getStats();
      
      if (response.success) {
        setDbStats(response.data);
      } else {
        console.error('Error al cargar estadísticas:', response.error);
        // Fallback a datos simulados
        const mockStats = {
        servidor: {
          host: 'localhost',
          puerto: 3306,
          version: 'MySQL 8.0.33',
          uptime: '15 días, 8 horas',
          estado: 'Activo'
        },
        base_datos: {
          nombre: 'phisyomar_db',
          tamaño: '2.3 GB',
          tablas: 25,
          registros_totales: 125847,
          ultimo_backup: '2025-01-22 02:00:00'
        },
        rendimiento: {
          conexiones_activas: 12,
          consultas_por_segundo: 45,
          uso_memoria: '512 MB',
          uso_cpu: '15%',
          espacio_libre: '85.6 GB'
        },
        tablas_principales: [
          { nombre: 'pacientes', registros: 1247, tamaño: '45.2 MB' },
          { nombre: 'citas', registros: 8934, tamaño: '156.8 MB' },
          { nombre: 'historiales_medicos', registros: 1189, tamaño: '89.4 MB' },
          { nombre: 'usuarios', registros: 67, tamaño: '2.1 MB' },
          { nombre: 'terapeutas', registros: 15, tamaño: '0.8 MB' },
          { nombre: 'pagos', registros: 3456, tamaño: '78.9 MB' },
          { nombre: 'bitacoras', registros: 25689, tamaño: '234.5 MB' }
        ]
        };
        
        setDbStats(mockStats);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas de BD:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBackupHistory = async () => {
    try {
      const response = await databaseService.getBackups();
      
      if (response.success) {
        setBackupHistory(response.data);
      } else {
        console.error('Error al cargar backups:', response.error);
        // Fallback a datos simulados
        const mockBackups = [
        {
          id: 1,
          fecha: '2025-01-22 02:00:00',
          tamaño: '2.3 GB',
          tipo: 'Automático',
          estado: 'Exitoso',
          duracion: '3m 45s'
        },
        {
          id: 2,
          fecha: '2025-01-21 02:00:00',
          tamaño: '2.2 GB',
          tipo: 'Automático',
          estado: 'Exitoso',
          duracion: '3m 22s'
        },
        {
          id: 3,
          fecha: '2025-01-20 14:30:00',
          tamaño: '2.2 GB',
          tipo: 'Manual',
          estado: 'Exitoso',
          duracion: '3m 18s'
        },
        {
          id: 4,
          fecha: '2025-01-20 02:00:00',
          tamaño: '2.1 GB',
          tipo: 'Automático',
          estado: 'Exitoso',
          duracion: '3m 15s'
        }
        ];
        
        setBackupHistory(mockBackups);
      }
    } catch (error) {
      console.error('Error al cargar historial de backups:', error);
    }
  };

  const handleManualBackup = async () => {
    try {
      const response = await databaseService.createBackup('Backup manual desde interfaz');
      if (response.success) {
        alert('Backup iniciado exitosamente');
        fetchBackupHistory(); // Recargar historial
      } else {
        alert('Error al crear backup: ' + response.error);
      }
    } catch (error) {
      console.error('Error al crear backup:', error);
      alert('Error al crear backup');
    }
  };

  const handleOptimizeDatabase = async () => {
    try {
      const response = await databaseService.optimize();
      if (response.success) {
        alert('Base de datos optimizada exitosamente');
        fetchDatabaseStats(); // Recargar estadísticas
      } else {
        alert('Error al optimizar base de datos: ' + response.error);
      }
    } catch (error) {
      console.error('Error al optimizar:', error);
      alert('Error al optimizar base de datos');
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Administración de Base de Datos</h1>
          <p className="text-gray-600">Monitorea y administra la base de datos del sistema</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button 
            onClick={handleOptimizeDatabase}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
          >
            <Settings className="w-4 h-4" />
            Optimizar
          </button>
          <button 
            onClick={handleManualBackup}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Backup Manual
          </button>
        </div>
      </div>

      {/* Estado del Servidor */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Server className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-700">Estado del Servidor</h3>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600 font-semibold">Conectado</span>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Host:</span>
              <span className="font-mono">{dbStats.servidor?.host}</span>
            </div>
            <div className="flex justify-between">
              <span>Puerto:</span>
              <span className="font-mono">{dbStats.servidor?.puerto}</span>
            </div>
            <div className="flex justify-between">
              <span>Versión:</span>
              <span>{dbStats.servidor?.version}</span>
            </div>
            <div className="flex justify-between">
              <span>Uptime:</span>
              <span>{dbStats.servidor?.uptime}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-700">Base de Datos</h3>
                <p className="text-lg font-bold text-gray-900">{dbStats.base_datos?.nombre}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Tamaño:</span>
              <span className="font-semibold">{dbStats.base_datos?.tamaño}</span>
            </div>
            <div className="flex justify-between">
              <span>Tablas:</span>
              <span className="font-semibold">{dbStats.base_datos?.tablas}</span>
            </div>
            <div className="flex justify-between">
              <span>Registros:</span>
              <span className="font-semibold">{dbStats.base_datos?.registros_totales?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-700">Rendimiento</h3>
                <p className="text-lg font-bold text-gray-900">{dbStats.rendimiento?.consultas_por_segundo} QPS</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Conexiones:</span>
              <span className="font-semibold">{dbStats.rendimiento?.conexiones_activas}</span>
            </div>
            <div className="flex justify-between">
              <span>Memoria:</span>
              <span className="font-semibold">{dbStats.rendimiento?.uso_memoria}</span>
            </div>
            <div className="flex justify-between">
              <span>CPU:</span>
              <span className="font-semibold">{dbStats.rendimiento?.uso_cpu}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <HardDrive className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-700">Almacenamiento</h3>
                <p className="text-lg font-bold text-gray-900">{dbStats.rendimiento?.espacio_libre}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Espacio libre</span>
              <span className="font-semibold text-green-600">92%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
            <p className="text-xs text-gray-500">Último backup: {new Date(dbStats.base_datos?.ultimo_backup || '').toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tablas Principales */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Tablas Principales</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tabla</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registros</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamaño</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dbStats.tablas_principales?.map((tabla, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Database className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{tabla.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {tabla.registros.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {tabla.tamaño}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Activa
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historial de Backups */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Historial de Backups</h3>
            <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tamaño</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duración</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {backupHistory.map((backup) => (
                <tr key={backup.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(backup.fecha).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      backup.tipo === 'Automático' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {backup.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {backup.tamaño}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {backup.duracion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      backup.estado === 'Exitoso'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {backup.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-700">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-700">
                        <Upload className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}