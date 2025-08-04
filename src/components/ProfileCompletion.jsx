import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProfile from '../hooks/useProfile';
import { Card } from './ui/card';
import { Button } from './ui/button';
import LoadingSpinner from './LoadingSpinner';

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
    contacto_emergencia_nombre: '',
    contacto_emergencia_telefono: '',
    contacto_emergencia_parentesco: '',
    tutor_nombre: '',
    tutor_telefono: '',
    tutor_parentesco: '',
    tutor_direccion: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await completeProfile(formData);
      
      // Redirigir según el rol después de completar el perfil
      const userData = user?.user || user;
      const roleId = userData?.rol_id;
      
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
                return (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Formulario de terapeuta en desarrollo</p>
                  </div>
                );
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
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
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