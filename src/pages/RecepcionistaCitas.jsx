import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Calendar, 
  Search, 
  Filter,
  User, 
  Clock, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Receipt,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../hooks/useToast';
import LoadingSpinner from '../components/LoadingSpinner';
import PagoModal from '../components/PagoModal';
import api from '../services/api';
import useAuth from '../hooks/useAuth';

const RecepcionistaCitas = () => {
  const { user, isAuthenticated, token } = useAuth();
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estado: '',
    terapeuta_id: ''
  });
  const [busqueda, setBusqueda] = useState('');
  const [terapeutas, setTerapeutas] = useState([]);
  const [tarifas, setTarifas] = useState([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    console.log('Auth state:', { isAuthenticated, user, token: !!token });
    if (isAuthenticated) {
      cargarDatosIniciales();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      cargarCitas();
    }
  }, [filtros, isAuthenticated]);

  const cargarDatosIniciales = async () => {
    try {
      const [terapeutasRes, tarifasRes] = await Promise.all([
        api.get('/terapeutas'),
        api.get('/recepcionista/tarifas')
      ]);
      
      setTerapeutas(terapeutasRes.data.data || []);
      setTarifas(tarifasRes.data.data || []);
    } catch (err) {
      console.error('Error al cargar datos iniciales:', err);
      showError('Error al cargar datos iniciales');
    }
  };

  const cargarCitas = async () => {
    if (!isAuthenticated) {
      console.log('Not authenticated, skipping citas load');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await api.get(`/recepcionista/citas?${params}`);
      console.log('API Response:', response.data);
      const citasData = response.data.data || response.data || [];
      console.log('Citas Data:', citasData, 'Is Array:', Array.isArray(citasData));
      setCitas(Array.isArray(citasData) ? citasData : []);
    } catch (err) {
      console.error('Error al cargar citas:', err);
      setError(err.response?.data?.message || 'Error al cargar las citas');
      showError('Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const citasFiltradas = (Array.isArray(citas) ? citas : []).filter(cita => {
    if (!busqueda) return true;
    
    const nombrePaciente = `${cita.paciente?.usuario?.nombre || ''} ${cita.paciente?.usuario?.apellido_paterno || ''}`.toLowerCase();
    const nombreTerapeuta = `${cita.terapeuta?.usuario?.nombre || ''} ${cita.terapeuta?.usuario?.apellido_paterno || ''}`.toLowerCase();
    
    return nombrePaciente.includes(busqueda.toLowerCase()) || 
           nombreTerapeuta.includes(busqueda.toLowerCase());
  });

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const procesarPago = async (datosPago) => {
    try {
      const response = await api.post(`/recepcionista/citas/${citaSeleccionada.id}/pago`, datosPago);
      
      if (response.data.success) {
        showSuccess('Pago procesado exitosamente');
        setMostrarModalPago(false);
        setCitaSeleccionada(null);
        cargarCitas(); // Recargar las citas para actualizar el estado
      }
    } catch (err) {
      console.error('Error al procesar pago:', err);
      showError(err.response?.data?.message || 'Error al procesar el pago');
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatearHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(monto);
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      'agendada': { color: 'bg-blue-100 text-blue-800', text: 'Agendada' },
      'atendida': { color: 'bg-green-100 text-green-800', text: 'Atendida' },
      'cancelada': { color: 'bg-red-100 text-red-800', text: 'Cancelada' },
      'no_asistio': { color: 'bg-yellow-100 text-yellow-800', text: 'No asistió' },
      'reprogramada': { color: 'bg-purple-100 text-purple-800', text: 'Reprogramada' }
    };
    
    const estadoInfo = estados[estado] || { color: 'bg-gray-100 text-gray-800', text: estado };
    
    return (
      <Badge className={`${estadoInfo.color} border-0`}>
        {estadoInfo.text}
      </Badge>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Necesitas iniciar sesión como recepcionista</p>
          <a href="/login" className="text-blue-600 hover:underline">Ir a Login</a>
        </div>
      </div>
    );
  }

  if (loading && (!citas || citas.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Citas</h1>
              <p className="text-gray-600 mt-1">Administra las citas y procesa los pagos</p>
            </div>
            <Button onClick={cargarCitas} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtros.fecha_inicio}
                  onChange={(e) => handleFiltroChange('fecha_inicio', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtros.fecha_fin}
                  onChange={(e) => handleFiltroChange('fecha_fin', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtros.estado}
                  onChange={(e) => handleFiltroChange('estado', e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="agendada">Agendada</option>
                  <option value="atendida">Atendida</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="no_asistio">No asistió</option>
                  <option value="reprogramada">Reprogramada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Terapeuta
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filtros.terapeuta_id}
                  onChange={(e) => handleFiltroChange('terapeuta_id', e.target.value)}
                >
                  <option value="">Todos los terapeutas</option>
                  {terapeutas.map((terapeuta) => (
                    <option key={terapeuta.id} value={terapeuta.id}>
                      {terapeuta.usuario?.nombre} {terapeuta.usuario?.apellido_paterno}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por paciente o terapeuta..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Lista de Citas */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center text-red-800">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {!Array.isArray(citasFiltradas) || citasFiltradas.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No se encontraron citas con los filtros seleccionados</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            citasFiltradas.map((cita) => (
              <Card key={cita.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Información del Paciente */}
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {cita.paciente?.usuario?.nombre} {cita.paciente?.usuario?.apellido_paterno}
                            </p>
                            <p className="text-sm text-gray-500">Paciente</p>
                          </div>
                        </div>

                        {/* Información del Terapeuta */}
                        <div className="flex items-center">
                          <User className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {cita.terapeuta?.usuario?.nombre} {cita.terapeuta?.usuario?.apellido_paterno}
                            </p>
                            <p className="text-sm text-gray-500">Terapeuta</p>
                          </div>
                        </div>

                        {/* Fecha y Hora */}
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatearFecha(cita.fecha_hora)}
                            </p>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatearHora(cita.fecha_hora)}
                            </p>
                          </div>
                        </div>

                        {/* Información de Pago */}
                        <div className="flex items-center">
                          <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {formatearMonto(cita.costo_consulta)}
                            </p>
                            <div className="flex items-center mt-1">
                              {cita.pagada ? (
                                <Badge className="bg-green-100 text-green-800 border-0">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Pagada
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 text-red-800 border-0">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Pendiente
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Información adicional */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {getEstadoBadge(cita.estado)}
                          {cita.motivo && (
                            <span className="text-sm text-gray-600">
                              Motivo: {cita.motivo}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {!cita.pagada && cita.estado !== 'cancelada' && (
                            <Button 
                              size="sm"
                              onClick={() => {
                                setCitaSeleccionada(cita);
                                setMostrarModalPago(true);
                              }}
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Procesar Pago
                            </Button>
                          )}
                          
                          {cita.pagada && (
                            <Button variant="outline" size="sm">
                              <Receipt className="w-4 h-4 mr-2" />
                              Recibo
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Modal de Pago */}
        {mostrarModalPago && citaSeleccionada && (
          <PagoModal
            cita={citaSeleccionada}
            tarifas={tarifas}
            onProcesarPago={procesarPago}
            onCerrar={() => {
              setMostrarModalPago(false);
              setCitaSeleccionada(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RecepcionistaCitas;