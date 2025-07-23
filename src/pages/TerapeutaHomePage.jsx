import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Plus,
  Eye,
  FileText,
  BarChart3,
  Activity,
  Phone,
  Mail,
  User,
  X
} from 'lucide-react';
import { 
  getMisPacientes, 
  getEstadisticasTerapeuta, 
  getPacienteDetalle,
  actualizarEstadoCita,
  crearNotaPaciente,
  crearHistorialMedico,
  agregarRegistroHistorial
} from '../services/terapeutaService';

const TerapeutaHomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [estadisticas, setEstadisticas] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [mostrarFormularioNota, setMostrarFormularioNota] = useState(false);
  const [nuevaNota, setNuevaNota] = useState('');
  const [mostrarHistorialMedico, setMostrarHistorialMedico] = useState(false);
  const [datosHistorial, setDatosHistorial] = useState({
    observacion_general: '',
    alergias: '',
    medicamentos_actuales: '',
    antecedentes_familiares: '',
    cirugias_previas: '',
    lesiones_previas: ''
  });
  const [mostrarFormularioRegistro, setMostrarFormularioRegistro] = useState(false);
  const [nuevoRegistro, setNuevoRegistro] = useState({
    tipo: 'consulta',
    descripcion: '',
    observaciones: ''
  });

  // Determinar vista actual basada en la URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path.includes('/pacientes')) return 'pacientes';
    if (path.includes('/estadisticas')) return 'estadisticas';
    if (path.includes('/detalle-paciente')) return 'detalle-paciente';
    return 'dashboard';
  };

  const vista = getCurrentView();

  useEffect(() => {
    cargarDatos();
  }, []);

  // Cargar detalle del paciente cuando se accede a la ruta específica
  useEffect(() => {
    if (vista === 'detalle-paciente' && params.id) {
      cargarDetallePaciente(params.id);
    }
  }, [vista, params.id]);

  const cargarDetallePaciente = async (pacienteId) => {
    try {
      const detalle = await getPacienteDetalle(pacienteId);
      setPacienteSeleccionado(detalle);
    } catch (err) {
      setError(err.message);
    }
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [statsResponse, pacientesResponse] = await Promise.all([
        getEstadisticasTerapeuta(),
        getMisPacientes()
      ]);
      
      setEstadisticas(statsResponse);
      setPacientes(pacientesResponse);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verDetallePaciente = (pacienteId) => {
    navigate(`/terapeuta/detalle-paciente/${pacienteId}`);
  };

  const actualizarCita = async (citaId, nuevoEstado, notas = '') => {
    try {
      await actualizarEstadoCita(citaId, nuevoEstado, notas);
      await cargarDatos();
      if (pacienteSeleccionado && params.id) {
        await cargarDetallePaciente(params.id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const agregarNota = async () => {
    if (!nuevaNota.trim() || !pacienteSeleccionado) return;
    
    try {
      await crearNotaPaciente(pacienteSeleccionado.id, nuevaNota);
      setNuevaNota('');
      setMostrarFormularioNota(false);
      if (params.id) {
        await cargarDetallePaciente(params.id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const guardarHistorialMedico = async () => {
    if (!datosHistorial.observacion_general.trim() || !pacienteSeleccionado) return;
    
    try {
      await crearHistorialMedico(pacienteSeleccionado.id, datosHistorial);
      setMostrarHistorialMedico(false);
      if (params.id) {
        await cargarDetallePaciente(params.id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const agregarRegistro = async () => {
    if (!nuevoRegistro.descripcion.trim() || !pacienteSeleccionado) return;
    
    try {
      await agregarRegistroHistorial(pacienteSeleccionado.id, nuevoRegistro);
      setNuevoRegistro({
        tipo: 'consulta',
        descripcion: '',
        observaciones: ''
      });
      setMostrarFormularioRegistro(false);
      if (params.id) {
        await cargarDetallePaciente(params.id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={cargarDatos} className="mt-4">Reintentar</Button>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estadisticas?.resumen?.total_pacientes || 0}</div>
            <p className="text-xs text-gray-600">Pacientes únicos atendidos</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estadisticas?.resumen?.citas_completadas || 0}</div>
            <p className="text-xs text-gray-600">
              {estadisticas?.resumen?.tasa_completado || 0}% de efectividad
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Este Mes</CardTitle>
            <CalendarIcon className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{estadisticas?.periodo_actual?.citas_este_mes || 0}</div>
            <p className="text-xs text-gray-600">
              {estadisticas?.periodo_actual?.citas_esta_semana || 0} esta semana
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{estadisticas?.periodo_actual?.proximas_citas || 0}</div>
            <p className="text-xs text-gray-600">
              {estadisticas?.periodo_actual?.citas_hoy || 0} para hoy
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de pacientes recientes y tipos de cita */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pacientes Recientes
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/terapeuta/pacientes')}
              >
                Ver todos
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {pacientes.slice(0, 5).map((paciente) => (
                <div key={paciente.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium">{paciente.usuario?.nombre} {paciente.usuario?.apellido}</h4>
                    <p className="text-sm text-gray-600">{paciente.citas_count} citas totales</p>
                    {paciente.ultima_cita && (
                      <p className="text-xs text-gray-500">
                        Última: {new Date(paciente.ultima_cita.fecha_hora).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        paciente.ultima_cita?.estado === 'completada' ? 'success' :
                        paciente.ultima_cita?.estado === 'agendada' ? 'default' : 'secondary'
                      }
                    >
                      {paciente.ultima_cita?.estado || 'Sin citas'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => verDetallePaciente(paciente.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tipos de Cita Más Comunes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {estadisticas?.tipos_cita?.length > 0 ? (
                estadisticas.tipos_cita.map((tipo, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{tipo.tipo}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all" 
                          style={{ 
                            width: `${(tipo.total / estadisticas.tipos_cita[0].total) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600">{tipo.total}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No hay datos de tipos de cita</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actividad por día de la semana */}
      {estadisticas?.citas_por_dia && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Actividad por Día de la Semana (Últimas 4 semanas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {Object.entries(estadisticas.citas_por_dia).map(([dia, total]) => (
                <div key={dia} className="text-center">
                  <div className="text-sm font-medium text-gray-600 mb-2">{dia}</div>
                  <div className="text-2xl font-bold text-blue-600">{total}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.max(total / Math.max(...Object.values(estadisticas.citas_por_dia)) * 100, 5)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderListaPacientes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mis Pacientes</h2>
        <Button onClick={() => navigate('/terapeuta')} variant="outline">
          Volver al Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pacientes.map((paciente) => (
          <Card key={paciente.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">
                {paciente.usuario?.nombre} {paciente.usuario?.apellido}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{paciente.usuario?.email || 'No disponible'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{paciente.usuario?.telefono || 'No disponible'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span>{paciente.citas_count} citas totales</span>
                </div>
                {paciente.ultima_cita && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">
                      Última cita: {new Date(paciente.ultima_cita.fecha_hora).toLocaleDateString()}
                    </p>
                    <Badge 
                      variant={
                        paciente.ultima_cita.estado === 'completada' ? 'success' :
                        paciente.ultima_cita.estado === 'agendada' ? 'default' : 'secondary'
                      }
                      className="mt-1"
                    >
                      {paciente.ultima_cita.estado}
                    </Badge>
                  </div>
                )}
                <Button 
                  className="w-full mt-4"
                  onClick={() => verDetallePaciente(paciente.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDetallePaciente = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {pacienteSeleccionado?.usuario?.nombre} {pacienteSeleccionado?.usuario?.apellido}
        </h2>
        <div className="flex gap-2">
          <Button 
            onClick={() => setMostrarFormularioNota(!mostrarFormularioNota)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Nota
          </Button>
          <Button 
            onClick={() => setMostrarHistorialMedico(!mostrarHistorialMedico)}
            className="flex items-center gap-2"
            variant="outline"
          >
            <FileText className="h-4 w-4" />
            {(pacienteSeleccionado?.historial_medico || pacienteSeleccionado?.historial) ? 'Ver Historial' : 'Crear Historial'}
          </Button>
          <Button onClick={() => navigate('/terapeuta/pacientes')} variant="outline">
            Volver a Pacientes
          </Button>
        </div>
      </div>

      {mostrarFormularioNota && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Nota del Paciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <textarea
                value={nuevaNota}
                onChange={(e) => setNuevaNota(e.target.value)}
                placeholder="Escribe una nota sobre el paciente..."
                className="w-full p-3 border rounded-lg resize-none h-24"
              />
              <div className="flex gap-2">
                <Button onClick={agregarNota} disabled={!nuevaNota.trim()}>
                  Guardar Nota
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setMostrarFormularioNota(false);
                    setNuevaNota('');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {mostrarHistorialMedico && (
        <Card>
          <CardHeader>
            <CardTitle>
              {pacienteSeleccionado?.historial_medico ? 'Historial Médico' : 'Crear Historial Médico'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Observación General *</label>
                <textarea
                  value={datosHistorial.observacion_general}
                  onChange={(e) => setDatosHistorial({...datosHistorial, observacion_general: e.target.value})}
                  placeholder="Descripción general del estado del paciente..."
                  className="w-full p-3 border rounded-lg resize-none h-24"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Alergias</label>
                  <textarea
                    value={datosHistorial.alergias}
                    onChange={(e) => setDatosHistorial({...datosHistorial, alergias: e.target.value})}
                    placeholder="Alergias conocidas del paciente..."
                    className="w-full p-3 border rounded-lg resize-none h-20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Medicamentos Actuales</label>
                  <textarea
                    value={datosHistorial.medicamentos_actuales}
                    onChange={(e) => setDatosHistorial({...datosHistorial, medicamentos_actuales: e.target.value})}
                    placeholder="Medicamentos que toma actualmente..."
                    className="w-full p-3 border rounded-lg resize-none h-20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Antecedentes Familiares</label>
                  <textarea
                    value={datosHistorial.antecedentes_familiares}
                    onChange={(e) => setDatosHistorial({...datosHistorial, antecedentes_familiares: e.target.value})}
                    placeholder="Historial médico familiar relevante..."
                    className="w-full p-3 border rounded-lg resize-none h-20"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Cirugías Previas</label>
                  <textarea
                    value={datosHistorial.cirugias_previas}
                    onChange={(e) => setDatosHistorial({...datosHistorial, cirugias_previas: e.target.value})}
                    placeholder="Cirugías o procedimientos anteriores..."
                    className="w-full p-3 border rounded-lg resize-none h-20"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Lesiones Previas</label>
                  <textarea
                    value={datosHistorial.lesiones_previas}
                    onChange={(e) => setDatosHistorial({...datosHistorial, lesiones_previas: e.target.value})}
                    placeholder="Lesiones o traumatismos anteriores..."
                    className="w-full p-3 border rounded-lg resize-none h-20"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={guardarHistorialMedico} disabled={!datosHistorial.observacion_general.trim()}>
                  {pacienteSeleccionado?.historial_medico ? 'Actualizar Historial' : 'Crear Historial'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setMostrarHistorialMedico(false);
                    setDatosHistorial({
                      observacion_general: '',
                      alergias: '',
                      medicamentos_actuales: '',
                      antecedentes_familiares: '',
                      cirugias_previas: '',
                      lesiones_previas: ''
                    });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre Completo:</label>
                <p className="font-medium">
                  {pacienteSeleccionado?.usuario?.nombre} {pacienteSeleccionado?.usuario?.apellido_paterno} {pacienteSeleccionado?.usuario?.apellido_materno}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email:</label>
                <p>{pacienteSeleccionado?.usuario?.correo_electronico || 'No disponible'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Teléfono:</label>
                <p>{pacienteSeleccionado?.usuario?.telefono || 'No disponible'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Nacimiento:</label>
                <p>{pacienteSeleccionado?.usuario?.fecha_nacimiento ? new Date(pacienteSeleccionado.usuario.fecha_nacimiento).toLocaleDateString() : 'No disponible'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Sexo:</label>
                <p>{pacienteSeleccionado?.usuario?.sexo || 'No disponible'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">CURP:</label>
                <p className="text-xs">{pacienteSeleccionado?.usuario?.curp || 'No disponible'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Ocupación:</label>
                <p>{pacienteSeleccionado?.usuario?.ocupacion || 'No disponible'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Dirección:</label>
                <p className="text-sm">{pacienteSeleccionado?.usuario?.direccion || 'No disponible'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contactos de Emergencia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contactos de Emergencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Contacto de Emergencia</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nombre:</label>
                    <p>{pacienteSeleccionado?.contacto_emergencia_nombre || 'No disponible'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Teléfono:</label>
                    <p>{pacienteSeleccionado?.contacto_emergencia_telefono || 'No disponible'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Parentesco:</label>
                    <p>{pacienteSeleccionado?.contacto_emergencia_parentesco || 'No disponible'}</p>
                  </div>
                </div>
              </div>

              {(pacienteSeleccionado?.tutor_nombre || pacienteSeleccionado?.tutor_telefono) && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Tutor/Responsable</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nombre:</label>
                      <p>{pacienteSeleccionado?.tutor_nombre || 'No disponible'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Teléfono:</label>
                      <p>{pacienteSeleccionado?.tutor_telefono || 'No disponible'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Parentesco:</label>
                      <p>{pacienteSeleccionado?.tutor_parentesco || 'No disponible'}</p>
                    </div>
                    {pacienteSeleccionado?.tutor_direccion && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Dirección:</label>
                        <p className="text-sm">{pacienteSeleccionado.tutor_direccion}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Historial Médico Resumen */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Historial Médico
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pacienteSeleccionado?.historial_medico || pacienteSeleccionado?.historial ? (
              <div className="space-y-3">
                {(() => {
                  const historial = pacienteSeleccionado.historial_medico || pacienteSeleccionado.historial;
                  return (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Observación General:</label>
                        <p className="text-sm">{historial.observacion_general}</p>
                      </div>
                      {historial.alergias && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Alergias:</label>
                          <p className="text-sm">{historial.alergias}</p>
                        </div>
                      )}
                      {historial.medicamentos_actuales && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Medicamentos:</label>
                          <p className="text-sm">{historial.medicamentos_actuales}</p>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-gray-600">Última actualización:</label>
                        <p className="text-sm">{new Date(historial.fecha_creacion || historial.created_at).toLocaleDateString()}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-4">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No hay historial médico</p>
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => setMostrarHistorialMedico(true)}
                >
                  Crear Historial
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notas y Registros del Terapeuta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notas y Registros Médicos ({pacienteSeleccionado?.historial_medico?.registros?.length || 0})
            </div>
            <Button 
              size="sm" 
              onClick={() => setMostrarFormularioNota(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar Nota
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pacienteSeleccionado?.historial_medico?.registros?.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {pacienteSeleccionado.historial_medico.registros.map((registro, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{registro.Motivo_Visita}</p>
                      {registro.Antecedentes && (
                        <p className="text-xs text-gray-600 mt-1 italic">{registro.Antecedentes}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {new Date(registro.Fecha_Hora).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No hay notas registradas para este paciente</p>
              <p className="text-xs mt-1">Utiliza el botón "Agregar Nota" para crear la primera nota</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Historial de Citas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Historial de Citas ({pacienteSeleccionado?.citas?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {pacienteSeleccionado?.citas?.length > 0 ? (
              pacienteSeleccionado.citas.map((cita) => (
                <div key={cita.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-medium text-lg">{cita.tipo}</span>
                      <p className="text-sm text-gray-600">
                        {new Date(cita.fecha_hora).toLocaleDateString()} - {new Date(cita.fecha_hora).toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant={
                      cita.estado === 'completada' ? 'success' :
                      cita.estado === 'agendada' ? 'default' : 'secondary'
                    }>
                      {cita.estado}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Motivo:</label>
                      <p className="text-sm">{cita.motivo}</p>
                    </div>
                    
                    {cita.duracion && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Duración:</label>
                        <p className="text-sm">{cita.duracion} minutos</p>
                      </div>
                    )}
                    
                    {cita.observaciones && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Observaciones:</label>
                        <p className="text-sm">{cita.observaciones}</p>
                      </div>
                    )}
                    
                    {cita.notas_terapeuta && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Notas del Terapeuta:</label>
                        <p className="text-sm bg-blue-50 p-2 rounded">{cita.notas_terapeuta}</p>
                      </div>
                    )}
                    
                    {cita.escala_dolor_eva_inicio && (
                      <div>
                        <label className="text-sm font-medium text-gray-600">Escala de Dolor (EVA):</label>
                        <p className="text-sm">Inicio: {cita.escala_dolor_eva_inicio}/10</p>
                      </div>
                    )}
                  </div>
                  
                  {cita.estado === 'agendada' && (
                    <div className="flex gap-2 mt-4 pt-3 border-t">
                      <Button 
                        size="sm" 
                        onClick={() => actualizarCita(cita.id, 'completada')}
                        className="flex items-center gap-1"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Completar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => actualizarCita(cita.id, 'cancelada')}
                        className="flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay citas registradas</p>
                <p className="text-sm text-gray-400">Las citas aparecerán aquí cuando sean agendadas</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEstadisticasDetalladas = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Estadísticas Detalladas</h2>
        <Button onClick={() => navigate('/terapeuta')} variant="outline">
          Volver al Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumen General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total de citas:</span>
                <span className="font-medium">{estadisticas?.resumen?.total_citas || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Completadas:</span>
                <span className="font-medium text-green-600">{estadisticas?.resumen?.citas_completadas || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Canceladas:</span>
                <span className="font-medium text-red-600">{estadisticas?.resumen?.citas_canceladas || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Tasa de éxito:</span>
                <span className="font-medium">{estadisticas?.resumen?.tasa_completado || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Periodo Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Hoy:</span>
                <span className="font-medium">{estadisticas?.periodo_actual?.citas_hoy || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Esta semana:</span>
                <span className="font-medium">{estadisticas?.periodo_actual?.citas_esta_semana || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Este mes:</span>
                <span className="font-medium">{estadisticas?.periodo_actual?.citas_este_mes || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Próximas:</span>
                <span className="font-medium">{estadisticas?.periodo_actual?.proximas_citas || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipos de Tratamiento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {estadisticas?.tipos_cita?.map((tipo, index) => (
                <div key={index} className="flex justify-between">
                  <span className="truncate">{tipo.tipo}:</span>
                  <span className="font-medium">{tipo.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard del Terapeuta</h1>
        <p className="text-gray-600">Gestiona tus pacientes y revisa tus estadísticas</p>
      </div>

      {vista === 'dashboard' && renderDashboard()}
      {vista === 'pacientes' && renderListaPacientes()}
      {vista === 'detalle-paciente' && renderDetallePaciente()}
      {vista === 'estadisticas' && renderEstadisticasDetalladas()}
    </div>
  );
};

export default TerapeutaHomePage;