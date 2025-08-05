import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  ArrowLeft,
  UserCheck,
  FileText
} from 'lucide-react';
import { getTerapeutaById } from '../services/terapeutaService';
import { getProfileData } from '../services/profileService';
import { useAuthStore } from '../store/authStore';
import LoadingSpinner from '../components/LoadingSpinner';

const TerapeutaProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [terapeuta, setTerapeuta] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    loadTerapeutaData();
  }, [id]);

  const loadTerapeutaData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Si no hay ID o es el perfil propio, usar la API de perfil
      if (!id || (user && String(user.id) === String(id))) {
        setIsOwnProfile(true);
        const response = await getProfileData();
        setProfileData(response.data);
        setTerapeuta(response.data.terapeuta);
      } else {
        // Si hay ID y no es el perfil propio, usar la API de terapeutas
        setIsOwnProfile(false);
        const response = await getTerapeutaById(id);
        setTerapeuta(response.data);
      }
    } catch (err) {
      console.error('Error al cargar datos del terapeuta:', err);
      setError(err.message || 'Error al cargar los datos del terapeuta');
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
                <FileText className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar perfil</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Regresar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!terapeuta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <User className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Terapeuta no encontrado</h3>
              <p className="text-gray-600 mb-4">No se encontraron datos del terapeuta</p>
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Regresar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userData = isOwnProfile ? profileData?.user : terapeuta.usuario;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => navigate(-1)} 
              variant="ghost" 
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Regresar
            </Button>
            {isOwnProfile && (
              <Button 
                onClick={() => navigate('/profile/edit')}
                className="mb-4"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              {userData?.nombre} {userData?.apellido_paterno} {userData?.apellido_materno}
            </h1>
            <p className="text-lg text-gray-600 mt-2">Fisioterapeuta</p>
            <div className="flex justify-center mt-4">
              <Badge 
                variant={terapeuta.estatus === 'activo' ? 'default' : 'secondary'}
                className="capitalize"
              >
                <UserCheck className="w-3 h-3 mr-1" />
                {terapeuta.estatus}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Personal */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Correo Electrónico</label>
                    <div className="flex items-center mt-1">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{userData?.correo_electronico || 'No especificado'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Teléfono</label>
                    <div className="flex items-center mt-1">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{formatTelefono(userData?.telefono)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Dirección</label>
                    <div className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{userData?.direccion || 'No especificada'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fecha de Nacimiento</label>
                    <div className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-gray-900">{formatFecha(userData?.fecha_nacimiento)}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Sexo</label>
                    <span className="text-gray-900 ml-2">{userData?.sexo || 'No especificado'}</span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">CURP</label>
                    <span className="text-gray-900 ml-2">{userData?.curp || 'No especificado'}</span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ocupación</label>
                    <span className="text-gray-900 ml-2">{userData?.ocupacion || 'No especificada'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información Profesional */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Información Profesional
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Cédula Profesional</label>
                  <div className="flex items-center mt-1">
                    <Award className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{terapeuta.cedula_profesional || 'No especificada'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Especialidad Principal</label>
                  <div className="flex items-center mt-1">
                    <FileText className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">{terapeuta.especialidad_principal || 'No especificada'}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Años de Experiencia</label>
                  <div className="flex items-center mt-1">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {terapeuta.experiencia_anios ? `${terapeuta.experiencia_anios} años` : 'No especificado'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Especialidades */}
            {terapeuta.especialidades && terapeuta.especialidades.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Especialidades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {terapeuta.especialidades.map((especialidad) => (
                      <Badge key={especialidad.id} variant="outline">
                        {especialidad.name || especialidad.nombre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Información adicional si es el perfil propio */}
        {isOwnProfile && profileData && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Estado del Perfil</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Completitud del perfil: {profileData.profile_complete ? 'Completo' : 'Incompleto'}
                    </p>
                    {profileData.missing_fields && profileData.missing_fields.length > 0 && (
                      <p className="text-sm text-red-600 mt-1">
                        Campos faltantes: {profileData.missing_fields.join(', ')}
                      </p>
                    )}
                  </div>
                  <Badge variant={profileData.profile_complete ? 'default' : 'destructive'}>
                    {profileData.profile_complete ? 'Completo' : 'Incompleto'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerapeutaProfile;