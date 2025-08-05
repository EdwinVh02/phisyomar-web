import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useProfile from '../hooks/useProfile';
import { Card } from './ui/card';
import { Button } from './ui/button';
import LoadingSpinner from './LoadingSpinner';
import { getEspecialidades } from '../services/especialidadService';

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const { 
    completeProfile, 
    isLoading, 
    error, 
    user, 
    missingFields,
    clearError 
  } = useProfile();


  const [formData, setFormData] = useState({
    // Campos de paciente
    contacto_emergencia_nombre: '',
    contacto_emergencia_telefono: '',
    contacto_emergencia_parentesco: '',
    tutor_nombre: '',
    tutor_telefono: '',
    tutor_parentesco: '',
    tutor_direccion: '',
    // Campos de terapeuta
    cedula_profesional: '',
    especialidad_principal: '',
    experiencia_anios: '',
  });

  const [especialidades, setEspecialidades] = useState([]);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);

  // Cargar especialidades cuando se monta el componente
  useEffect(() => {
    const loadEspecialidades = async () => {
      try {
        setLoadingEspecialidades(true);
        const response = await getEspecialidades();
        setEspecialidades(response.data || []);
      } catch (err) {
        console.error('Error al cargar especialidades:', err);
      } finally {
        setLoadingEspecialidades(false);
      }
    };

    loadEspecialidades();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) clearError();
  };

  const validateTerapeutaForm = () => {
    const errors = [];
    
    if (!formData.cedula_profesional.trim()) {
      errors.push('La cédula profesional es obligatoria');
    } else if (!/^[0-9]{6,10}$/.test(formData.cedula_profesional)) {
      errors.push('La cédula profesional debe tener entre 6 y 10 dígitos');
    }
    
    if (!formData.especialidad_principal.trim()) {
      errors.push('La especialidad principal es obligatoria');
    }
    
    if (!formData.experiencia_anios.trim()) {
      errors.push('Los años de experiencia son obligatorios');
    }
    
    return errors;
  };

  const validatePacienteForm = () => {
    const errors = [];
    
    if (!formData.contacto_emergencia_nombre.trim()) {
      errors.push('El nombre del contacto de emergencia es obligatorio');
    }
    
    if (!formData.contacto_emergencia_telefono.trim()) {
      errors.push('El teléfono de emergencia es obligatorio');
    }
    
    if (!formData.contacto_emergencia_parentesco.trim()) {
      errors.push('El parentesco del contacto de emergencia es obligatorio');
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar según el rol
    const userData = user?.user || user;
    const roleId = userData?.rol_id;
    
    let validationErrors = [];
    if (roleId === 2) {
      validationErrors = validateTerapeutaForm();
    } else if (roleId === 4) {
      validationErrors = validatePacienteForm();
    }
    
    if (validationErrors.length > 0) {
      setError(`Errores de validación: ${validationErrors.join(', ')}`);
      return;
    }
    
    try {
      // Filtrar solo los campos necesarios según el rol
      let profileDataToSend = {};
      
      if (roleId === 2) {
        // Datos de terapeuta
        profileDataToSend = {
          cedula_profesional: formData.cedula_profesional,
          especialidad_principal: formData.especialidad_principal,
          experiencia_anios: parseInt(formData.experiencia_anios, 10),
        };
      } else if (roleId === 4) {
        // Datos de paciente
        profileDataToSend = {
          contacto_emergencia_nombre: formData.contacto_emergencia_nombre,
          contacto_emergencia_telefono: formData.contacto_emergencia_telefono,
          contacto_emergencia_parentesco: formData.contacto_emergencia_parentesco,
          tutor_nombre: formData.tutor_nombre || null,
          tutor_telefono: formData.tutor_telefono || null,
          tutor_parentesco: formData.tutor_parentesco || null,
          tutor_direccion: formData.tutor_direccion || null,
        };
      }
      
      await completeProfile(profileDataToSend);
      
      // Redirigir según el rol después de completar el perfil
      switch (roleId) {
        case 4: // Paciente
          navigate('/paciente/dashboard');
          break;
        case 2: // Terapeuta
          navigate('/terapeuta/dashboard');
          break;
        case 3: // Recepcionista
          navigate('/recepcionista/dashboard');
          break;
        case 1: // Administrador
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error al completar perfil:', err);
    }
  };

  const getFormTitle = () => {
    const userData = user?.user || user;
    const roleId = userData?.rol_id;
    
    switch (roleId) {
      case 4:
        return 'Completar Perfil de Paciente';
      case 2:
        return 'Completar Perfil de Terapeuta';
      case 3:
        return 'Completar Perfil de Recepcionista';
      case 1:
        return 'Completar Perfil de Administrador';
      default:
        return 'Completar Perfil';
    }
  };

  const renderPacienteForm = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="contacto_emergencia_nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Contacto de Emergencia *
          </label>
          <input
            type="text"
            id="contacto_emergencia_nombre"
            name="contacto_emergencia_nombre"
            value={formData.contacto_emergencia_nombre}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: Juan Pérez"
          />
        </div>

        <div>
          <label htmlFor="contacto_emergencia_telefono" className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono de Emergencia *
          </label>
          <input
            type="tel"
            id="contacto_emergencia_telefono"
            name="contacto_emergencia_telefono"
            value={formData.contacto_emergencia_telefono}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 555-1234"
          />
        </div>

        <div>
          <label htmlFor="contacto_emergencia_parentesco" className="block text-sm font-medium text-gray-700 mb-1">
            Parentesco *
          </label>
          <select
            id="contacto_emergencia_parentesco"
            name="contacto_emergencia_parentesco"
            value={formData.contacto_emergencia_parentesco}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar parentesco</option>
            <option value="Padre">Padre</option>
            <option value="Madre">Madre</option>
            <option value="Hermano">Hermano</option>
            <option value="Hermana">Hermana</option>
            <option value="Esposo">Esposo</option>
            <option value="Esposa">Esposa</option>
            <option value="Hijo">Hijo</option>
            <option value="Hija">Hija</option>
            <option value="Amigo">Amigo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Tutor (Opcional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="tutor_nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Tutor
            </label>
            <input
              type="text"
              id="tutor_nombre"
              name="tutor_nombre"
              value={formData.tutor_nombre}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Solo si es menor de edad"
            />
          </div>

          <div>
            <label htmlFor="tutor_telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono del Tutor
            </label>
            <input
              type="tel"
              id="tutor_telefono"
              name="tutor_telefono"
              value={formData.tutor_telefono}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 555-5678"
            />
          </div>

          <div>
            <label htmlFor="tutor_parentesco" className="block text-sm font-medium text-gray-700 mb-1">
              Parentesco del Tutor
            </label>
            <input
              type="text"
              id="tutor_parentesco"
              name="tutor_parentesco"
              value={formData.tutor_parentesco}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Padre, Madre, Tutor legal"
            />
          </div>

          <div>
            <label htmlFor="tutor_direccion" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección del Tutor
            </label>
            <input
              type="text"
              id="tutor_direccion"
              name="tutor_direccion"
              value={formData.tutor_direccion}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dirección completa"
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderTerapeutaForm = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="cedula_profesional" className="block text-sm font-medium text-gray-700 mb-1">
            Cédula Profesional *
          </label>
          <input
            type="text"
            id="cedula_profesional"
            name="cedula_profesional"
            value={formData.cedula_profesional}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 12345678"
            pattern="[0-9]{6,10}"
            title="La cédula profesional debe tener entre 6 y 10 dígitos"
          />
          <p className="text-xs text-gray-500 mt-1">Número de cédula profesional emitida por la SEP</p>
        </div>

        <div>
          <label htmlFor="especialidad_principal" className="block text-sm font-medium text-gray-700 mb-1">
            Especialidad Principal *
          </label>
          {loadingEspecialidades ? (
            <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
              <span className="text-gray-500">Cargando especialidades...</span>
            </div>
          ) : (
            <select
              id="especialidad_principal"
              name="especialidad_principal"
              value={formData.especialidad_principal}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar especialidad</option>
              {especialidades.map((especialidad) => (
                <option key={especialidad.id} value={especialidad.nombre}>
                  {especialidad.nombre}
                </option>
              ))}
            </select>
          )}
          <p className="text-xs text-gray-500 mt-1">Selecciona tu área de especialización principal</p>
        </div>

        <div>
          <label htmlFor="experiencia_anios" className="block text-sm font-medium text-gray-700 mb-1">
            Años de Experiencia *
          </label>
          <select
            id="experiencia_anios"
            name="experiencia_anios"
            value={formData.experiencia_anios}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar años de experiencia</option>
            <option value="0">Menos de 1 año</option>
            <option value="1">1-2 años</option>
            <option value="4">3-5 años</option>
            <option value="8">6-10 años</option>
            <option value="13">11-15 años</option>
            <option value="18">16-20 años</option>
            <option value="25">Más de 20 años</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">Años de experiencia en fisioterapia</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Información importante
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• La cédula profesional debe ser válida y estar registrada ante la SEP</p>
              <p>• Esta información será verificada por el administrador del sistema</p>
              <p>• Una vez completado tu perfil, podrás comenzar a atender pacientes</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getFormTitle()}
            </h1>
            <p className="text-gray-600">
              Para continuar, necesitamos que completes tu información personal
            </p>
            {missingFields.length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  Campos obligatorios faltantes: {missingFields.join(', ')}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {(() => {
              const userData = user?.user || user;
              const roleId = userData?.rol_id;
              
              if (roleId === 4) {
                return renderPacienteForm();
              } else if (roleId === 2) {
                return renderTerapeutaForm();
              } else {
                return (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Rol no reconocido: {roleId}</p>
                    <p className="text-sm text-gray-500 mt-2">Estructura del usuario: {JSON.stringify(user, null, 2)}</p>
                  </div>
                );
              }
            })()}

            <div className="mt-8 flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || ((() => {
                  const userData = user?.user || user;
                  const roleId = userData?.rol_id;
                  if (roleId === 2) {
                    return !formData.cedula_profesional || !formData.especialidad_principal || !formData.experiencia_anios;
                  } else if (roleId === 4) {
                    return !formData.contacto_emergencia_nombre || !formData.contacto_emergencia_telefono || !formData.contacto_emergencia_parentesco;
                  }
                  return false;
                })())}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Guardando...' : 'Completar Perfil'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ProfileCompletion;