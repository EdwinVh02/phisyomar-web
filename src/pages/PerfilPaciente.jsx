import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { updateProfile } from '../services/usuarioService';
import useProfile from '../hooks/useProfile';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Heart, 
  Shield, 
  Clock,
  UserCircle,
  ContactRound,
  Cake,
  Briefcase,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';

export default function PerfilPaciente() {
  const { user, login } = useAuthStore();
  const { roleSpecificData } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Obtener datos del usuario con la estructura correcta
  const userData = user?.user || user;
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    correo_electronico: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    ocupacion: '',
    sexo: '',
    curp: ''
  });

  // Actualizar formData cuando cambie el usuario
  useEffect(() => {
    if (userData) {
      setFormData({
        nombre: userData?.nombre || '',
        apellido_paterno: userData?.apellido_paterno || '',
        apellido_materno: userData?.apellido_materno || '',
        correo_electronico: userData?.correo_electronico || '',
        telefono: userData?.telefono || '',
        direccion: userData?.direccion || '',
        fecha_nacimiento: userData?.fecha_nacimiento ? userData.fecha_nacimiento.split('T')[0] : '',
        ocupacion: userData?.ocupacion || '',
        sexo: userData?.sexo || '',
        curp: userData?.curp || ''
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // Validar campos requeridos
    if (!formData.nombre || !formData.apellido_paterno || !formData.correo_electronico) {
      setMessage({ 
        type: 'error', 
        text: 'Los campos Nombre, Apellido Paterno y Correo Electrónico son obligatorios' 
      });
      return;
    }

    // Validar CURP si está presente
    if (formData.curp && formData.curp.trim() === '') {
      setMessage({ 
        type: 'error', 
        text: 'El CURP no puede estar vacío. Si no lo tienes, déjalo sin llenar.' 
      });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await updateProfile(formData);
      
      // Actualizar el usuario en el store
      login(response.usuario, localStorage.getItem('token'));
      
      setMessage({ 
        type: 'success', 
        text: 'Perfil actualizado correctamente' 
      });
      setEditMode(false);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error al actualizar el perfil' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: userData?.nombre || '',
      apellido_paterno: userData?.apellido_paterno || '',
      apellido_materno: userData?.apellido_materno || '',
      correo_electronico: userData?.correo_electronico || '',
      telefono: userData?.telefono || '',
      direccion: userData?.direccion || '',
      fecha_nacimiento: userData?.fecha_nacimiento ? userData.fecha_nacimiento.split('T')[0] : '',
      ocupacion: userData?.ocupacion || '',
      sexo: userData?.sexo || '',
      curp: userData?.curp || ''
    });
    setEditMode(false);
    setMessage({ type: '', text: '' });
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 'No especificada';
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return `${edad} años`;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
        <p className="text-gray-600">Administra tu información personal</p>
      </div>

      {/* Mensaje de éxito/error */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        {/* Información Personal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta Principal */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {userData?.nombre} {userData?.apellido_paterno}
              </h2>
              <p className="text-blue-600 font-medium">Paciente</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Cuenta activa</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Correo</p>
                  <p className="font-medium text-gray-900">{userData?.correo_electronico}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Phone className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium text-gray-900">{userData?.telefono || 'No especificado'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Cake className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Edad</p>
                  <p className="font-medium text-gray-900">{calcularEdad(userData?.fecha_nacimiento)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditMode(true)}
              disabled={editMode || loading}
              className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit3 className="w-5 h-5" />
              Editar Perfil
            </button>
          </div>

          {/* Información Detallada */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <ContactRound className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Información Personal</h3>
                    <p className="text-gray-500 text-sm">Datos básicos de tu cuenta</p>
                  </div>
                </div>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nombre {editMode && <span className="text-red-500">*</span>}
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{userData?.nombre}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Apellido Paterno {editMode && <span className="text-red-500">*</span>}
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="apellido_paterno"
                      value={formData.apellido_paterno}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{userData?.apellido_paterno}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Apellido Materno</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="apellido_materno"
                      value={formData.apellido_materno}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{userData?.apellido_materno || 'No especificado'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Fecha de Nacimiento</label>
                  {editMode ? (
                    <input
                      type="date"
                      name="fecha_nacimiento"
                      value={formData.fecha_nacimiento}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{formatearFecha(userData?.fecha_nacimiento)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Sexo</label>
                  {editMode ? (
                    <select
                      name="sexo"
                      value={formData.sexo}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Femenino">Femenino</option>
                      <option value="Otro">Otro</option>
                    </select>
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                      {userData?.sexo || 'No especificado'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Ocupación</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="ocupacion"
                      value={formData.ocupacion}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{userData?.ocupacion || 'No especificada'}</p>
                  )}
                </div>
              </div>

              {editMode && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Guardar Cambios
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            {/* Información de Contacto */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Información de Contacto</h3>
                  <p className="text-gray-500 text-sm">Datos de contacto y ubicación</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Correo Electrónico {editMode && <span className="text-red-500">*</span>}
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      name="correo_electronico"
                      value={formData.correo_electronico}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{userData?.correo_electronico}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Teléfono</label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{userData?.telefono || 'No especificado'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Dirección</label>
                  {editMode ? (
                    <textarea
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{userData?.direccion || 'No especificada'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Información Adicional */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Información Adicional</h3>
                  <p className="text-gray-500 text-sm">Documentos e identificación</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">CURP</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="curp"
                      value={formData.curp}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{userData?.curp || 'No especificado'}</p>
                  )}
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-800">Información Importante</h4>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Mantén tu información actualizada para recibir notificaciones y comunicaciones importantes sobre tus citas médicas.
                  </p>
                </div>
              </div>
            </div>

            {/* Información de Contacto de Emergencia */}
            {roleSpecificData && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Contacto de Emergencia</h3>
                    <p className="text-gray-500 text-sm">Información para casos de emergencia</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Nombre del Contacto
                    </label>
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                      {roleSpecificData.contacto_emergencia_nombre || 'No especificado'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Teléfono de Emergencia
                    </label>
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                      {roleSpecificData.contacto_emergencia_telefono || 'No especificado'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Parentesco
                    </label>
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                      {roleSpecificData.contacto_emergencia_parentesco || 'No especificado'}
                    </p>
                  </div>
                </div>

                {/* Información del Tutor (si existe) */}
                {(roleSpecificData.tutor_nombre || roleSpecificData.tutor_telefono) && (
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Información del Tutor</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Nombre del Tutor
                        </label>
                        <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                          {roleSpecificData.tutor_nombre || 'No especificado'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Teléfono del Tutor
                        </label>
                        <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                          {roleSpecificData.tutor_telefono || 'No especificado'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Parentesco
                        </label>
                        <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                          {roleSpecificData.tutor_parentesco || 'No especificado'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Dirección del Tutor
                        </label>
                        <p className="p-3 bg-gray-50 rounded-lg text-gray-900">
                          {roleSpecificData.tutor_direccion || 'No especificada'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {(!roleSpecificData.contacto_emergencia_nombre && 
                  !roleSpecificData.contacto_emergencia_telefono && 
                  !roleSpecificData.contacto_emergencia_parentesco) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Información Pendiente</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Para tu seguridad, es importante que proporciones información de contacto de emergencia.
                    </p>
                    <button 
                      onClick={() => window.location.href = '/profile/complete'}
                      className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Completar Información
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
