import { useState, useEffect } from 'react';
import { Settings, Save, Bell, Lock, Mail, Database, Users, Calendar } from 'lucide-react';
import { configuracionService } from '../services';

export default function ConfiguracionPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [configuracion, setConfiguracion] = useState({
    general: {
      nombre_clinica: 'PhisyoMar',
      descripcion: 'Sistema de gestión médica para fisioterapia',
      direccion: 'Av. Revolución 1234, CDMX',
      telefono: '555-0100',
      email: 'contacto@phisyomar.com',
      timezone: 'America/Mexico_City',
      idioma: 'es'
    },
    notificaciones: {
      email_citas: true,
      sms_recordatorios: true,
      notif_pagos: true,
      notif_vencimientos: true,
      email_reportes: false,
      frecuencia_reportes: 'semanal'
    },
    seguridad: {
      sesion_timeout: 30,
      intentos_login: 3,
      bloqueo_tiempo: 15,
      requerir_2fa: false,
      complejidad_password: 'media',
      cambio_password_dias: 90
    },
    sistema: {
      backup_automatico: true,
      frecuencia_backup: 'diario',
      hora_backup: '02:00',
      retener_backups: 30,
      mantenimiento_auto: true,
      logs_nivel: 'info'
    }
  });

  useEffect(() => {
    fetchConfiguracion();
  }, []);

  const fetchConfiguracion = async () => {
    try {
      setLoading(true);
      
      const response = await configuracionService.getAll();
      
      if (response.success) {
        setConfiguracion(response.data);
      } else {
        console.error('Error al cargar configuración:', response.error);
      }
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (categoria) => {
    try {
      const response = await configuracionService.updateByCategory(categoria, configuracion[categoria]);
      
      if (response.success) {
        alert(`Configuración de ${categoria} guardada exitosamente`);
      } else {
        alert('Error al guardar la configuración: ' + response.error);
      }
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('Error al guardar la configuración');
    }
  };

  const handleInputChange = (categoria, campo, valor) => {
    setConfiguracion(prev => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [campo]: valor
      }
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'notificaciones', name: 'Notificaciones', icon: Bell },
    { id: 'seguridad', name: 'Seguridad', icon: Lock },
    { id: 'sistema', name: 'Sistema', icon: Database }
  ];

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración del Sistema</h1>
        <p className="text-gray-600">Administra las configuraciones generales del sistema</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Tabs */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Configuración General</h3>
                  <button
                    onClick={() => handleSave('general')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Clínica
                    </label>
                    <input
                      type="text"
                      value={configuracion.general.nombre_clinica}
                      onChange={(e) => handleInputChange('general', 'nombre_clinica', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email de Contacto
                    </label>
                    <input
                      type="email"
                      value={configuracion.general.email}
                      onChange={(e) => handleInputChange('general', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={configuracion.general.descripcion}
                      onChange={(e) => handleInputChange('general', 'descripcion', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={configuracion.general.direccion}
                      onChange={(e) => handleInputChange('general', 'direccion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={configuracion.general.telefono}
                      onChange={(e) => handleInputChange('general', 'telefono', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Zona Horaria
                    </label>
                    <select
                      value={configuracion.general.timezone}
                      onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                      <option value="America/Tijuana">Tijuana (GMT-8)</option>
                      <option value="America/Cancun">Cancún (GMT-5)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notificaciones' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Configuración de Notificaciones</h3>
                  <button
                    onClick={() => handleSave('notificaciones')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Notificaciones de Citas por Email</h4>
                      <p className="text-sm text-gray-600">Enviar confirmaciones y recordatorios por email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion.notificaciones.email_citas}
                        onChange={(e) => handleInputChange('notificaciones', 'email_citas', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Recordatorios por SMS</h4>
                      <p className="text-sm text-gray-600">Enviar recordatorios de citas por mensaje de texto</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion.notificaciones.sms_recordatorios}
                        onChange={(e) => handleInputChange('notificaciones', 'sms_recordatorios', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Notificaciones de Pagos</h4>
                      <p className="text-sm text-gray-600">Notificar cuando se procesen pagos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion.notificaciones.notif_pagos}
                        onChange={(e) => handleInputChange('notificaciones', 'notif_pagos', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frecuencia de Reportes Automáticos
                    </label>
                    <select
                      value={configuracion.notificaciones.frecuencia_reportes}
                      onChange={(e) => handleInputChange('notificaciones', 'frecuencia_reportes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="diario">Diario</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensual">Mensual</option>
                      <option value="nunca">Nunca</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'seguridad' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Configuración de Seguridad</h3>
                  <button
                    onClick={() => handleSave('seguridad')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiempo de Sesión (minutos)
                    </label>
                    <input
                      type="number"
                      value={configuracion.seguridad.sesion_timeout}
                      onChange={(e) => handleInputChange('seguridad', 'sesion_timeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Intentos de Login Máximos
                    </label>
                    <input
                      type="number"
                      value={configuracion.seguridad.intentos_login}
                      onChange={(e) => handleInputChange('seguridad', 'intentos_login', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiempo de Bloqueo (minutos)
                    </label>
                    <input
                      type="number"
                      value={configuracion.seguridad.bloqueo_tiempo}
                      onChange={(e) => handleInputChange('seguridad', 'bloqueo_tiempo', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complejidad de Contraseña
                    </label>
                    <select
                      value={configuracion.seguridad.complejidad_password}
                      onChange={(e) => handleInputChange('seguridad', 'complejidad_password', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Requerir Autenticación de Dos Factores</h4>
                        <p className="text-sm text-gray-600">Obligar a todos los usuarios a usar 2FA</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={configuracion.seguridad.requerir_2fa}
                          onChange={(e) => handleInputChange('seguridad', 'requerir_2fa', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'sistema' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Configuración del Sistema</h3>
                  <button
                    onClick={() => handleSave('sistema')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    Guardar
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Backup Automático</h4>
                      <p className="text-sm text-gray-600">Realizar respaldos automáticos de la base de datos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion.sistema.backup_automatico}
                        onChange={(e) => handleInputChange('sistema', 'backup_automatico', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frecuencia de Backup
                      </label>
                      <select
                        value={configuracion.sistema.frecuencia_backup}
                        onChange={(e) => handleInputChange('sistema', 'frecuencia_backup', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="diario">Diario</option>
                        <option value="semanal">Semanal</option>
                        <option value="mensual">Mensual</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Backup
                      </label>
                      <input
                        type="time"
                        value={configuracion.sistema.hora_backup}
                        onChange={(e) => handleInputChange('sistema', 'hora_backup', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Retener Backups (días)
                      </label>
                      <input
                        type="number"
                        value={configuracion.sistema.retener_backups}
                        onChange={(e) => handleInputChange('sistema', 'retener_backups', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nivel de Logs
                      </label>
                      <select
                        value={configuracion.sistema.logs_nivel}
                        onChange={(e) => handleInputChange('sistema', 'logs_nivel', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="debug">Debug</option>
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Mantenimiento Automático</h4>
                      <p className="text-sm text-gray-600">Realizar mantenimiento automático de la base de datos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configuracion.sistema.mantenimiento_auto}
                        onChange={(e) => handleInputChange('sistema', 'mantenimiento_auto', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}