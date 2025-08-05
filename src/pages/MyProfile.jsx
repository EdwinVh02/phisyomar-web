import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Briefcase, 
  Clock,
  Edit,
  UserCheck,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { getProfileData } from '../services/profileService';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

const MyProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProfileData();
      setProfileData(response.data);
    } catch (err) {
      console.error('Error al cargar datos del perfil:', err);
      setError(err.message || 'Error al cargar los datos del perfil');
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTelefono = (telefono) => {
    if (!telefono) return 'No especificado';
    return telefono.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  const getRoleDisplayName = (roleName) => {
    const roleMap = {
      'Administrador': 'Administrador',
      'Terapeuta': 'Fisioterapeuta',
      'Recepcionista': 'Recepcionista',
      'Paciente': 'Paciente'
    };
    return roleMap[roleName] || roleName;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 mb-2">
                <AlertCircle className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar perfil</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadProfileData} className="mr-2">
                Reintentar
              </Button>
              <Button onClick={() => navigate(-1)} variant="outline">
                Regresar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <User className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin datos de perfil</h3>
              <p className="text-gray-600 mb-4">No se encontraron datos del perfil</p>
              <Button onClick={loadProfileData}>
                Recargar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userData = profileData.user;
  const roleSpecificData = profileData.terapeuta || profileData.paciente || profileData.administrador || profileData.recepcionista;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <Button onClick={() => navigate('/profile/edit')}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Perfil
            </Button>
          </div>
        </div>

        {/* Estado del Perfil */}
        <div className="mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {profileData.profile_complete ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  )}
                  <div>
                    <p className="font-medium">
                      Perfil {profileData.profile_complete ? 'Completo' : 'Incompleto'}
                    </p>
                    {!profileData.profile_complete && profileData.missing_fields && profileData.missing_fields.length > 0 && (
                      <p className="text-sm text-gray-600">
                        Campos faltantes: {profileData.missing_fields.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={profileData.profile_complete ? 'default' : 'destructive'}>
                  {profileData.profile_complete ? 'Completo' : 'Incompleto'}
                </Badge>
              </div>
              {!profileData.profile_complete && (
                <div className="mt-4">
                  <Button onClick={() => navigate('/profile/complete')} size="sm">
                    Completar Perfil
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Información del Usuario */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {userData.nombre} {userData.apellido_paterno} {userData.apellido_materno}
            </h2>
            <p className="text-lg text-gray-600 mt-2">{getRoleDisplayName(profileData.role_name)}</p>
            <div className="flex justify-center mt-4">
              <Badge variant={userData.estatus === 'activo' ? 'default' : 'secondary'} className="capitalize">
                <UserCheck className="w-3 h-3 mr-1" />
                {userData.estatus}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Correo Electrónico</label>
                <div className="flex items-center mt-1">
                  <Mail className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{userData.correo_electronico}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Teléfono</label>
                <div className="flex items-center mt-1">
                  <Phone className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{formatTelefono(userData.telefono)}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Dirección</label>
                <div className="flex items-center mt-1">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{userData.direccion || 'No especificada'}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                <div className="flex items-center mt-1">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-900">{formatFecha(userData.fecha_nacimiento)}</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Sexo</label>
                <span className="text-gray-900 ml-2">{userData.sexo || 'No especificado'}</span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">CURP</label>
                <span className="text-gray-900 ml-2">{userData.curp || 'No especificado'}</span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Ocupación</label>
                <span className="text-gray-900 ml-2">{userData.ocupacion || 'No especificada'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Información Específica del Rol */}
          {roleSpecificData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Información {profileData.role_name === 'Terapeuta' ? 'Profesional' : 'Adicional'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Información de Terapeuta */}
                {profileData.terapeuta && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Cédula Profesional</label>
                      <div className="flex items-center mt-1">
                        <Award className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">
                          {profileData.terapeuta.cedula_profesional || 'No especificada'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Especialidad Principal</label>
                      <div className="flex items-center mt-1">
                        <FileText className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">
                          {profileData.terapeuta.especialidad_principal || 'No especificada'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Años de Experiencia</label>
                      <div className="flex items-center mt-1">
                        <Clock className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">
                          {profileData.terapeuta.experiencia_anios ? 
                            `${profileData.terapeuta.experiencia_anios} años` : 
                            'No especificado'
                          }
                        </span>
                      </div>
                    </div>
                    {/* Especialidades */}
                    {profileData.terapeuta.especialidades && profileData.terapeuta.especialidades.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 mb-2 block">Especialidades</label>
                        <div className="flex flex-wrap gap-2">
                          {profileData.terapeuta.especialidades.map((especialidad) => (
                            <Badge key={especialidad.id} variant="outline">
                              {especialidad.name || especialidad.nombre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Información de Paciente */}
                {profileData.paciente && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Contacto de Emergencia</label>
                      <div className="mt-1">
                        <span className="text-gray-900">
                          {profileData.paciente.contacto_emergencia_nombre || 'No especificado'}
                        </span>
                        {profileData.paciente.contacto_emergencia_telefono && (
                          <span className="text-gray-600 ml-2">
                            ({formatTelefono(profileData.paciente.contacto_emergencia_telefono)})
                          </span>
                        )}
                      </div>
                    </div>
                    {profileData.paciente.tutor_nombre && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tutor</label>
                        <div className="mt-1">
                          <span className="text-gray-900">{profileData.paciente.tutor_nombre}</span>
                          {profileData.paciente.tutor_telefono && (
                            <span className="text-gray-600 ml-2">
                              ({formatTelefono(profileData.paciente.tutor_telefono)})
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Información de Administrador */}
                {profileData.administrador && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cédula Profesional</label>
                    <div className="flex items-center mt-1">
                      <Award className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">
                        {profileData.administrador.cedula_profesional || 'No especificada'}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;