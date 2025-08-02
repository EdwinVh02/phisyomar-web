import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { useToast } from './useToast';

const useGoogleAuth = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { showError } = useToast();

  useEffect(() => {
    // Verificar si el script de Google se ha cargado
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts) {
        setIsGoogleLoaded(true);
        
        // Inicializar Google Identity Services con configuración actualizada
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });
      } else {
        setTimeout(checkGoogleLoaded, 100);
      }
    };

    checkGoogleLoaded();
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      // Decodificar el JWT token de Google
      const credential = response.credential;
      
      // Enviar el token al backend para validación
      const backendResponse = await fetch('https://phisyomarv2-production.up.railway.app/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credential
        })
      });

      if (backendResponse.ok) {
        const { usuario, token } = await backendResponse.json();
        
        // Iniciar sesión en el frontend
        login(usuario, token);
        
        // Redirigir según el rol
        switch (usuario.rol_id) {
          case 1:
            navigate('/admin');
            break;
          case 2:
            navigate('/terapeuta');
            break;
          case 3:
            navigate('/recepcionista');
            break;
          case 4:
            navigate('/paciente');
            break;
          default:
            navigate('/dashboard');
        }
      } else {
        const errorData = await backendResponse.json();
        console.error('Error al autenticar con Google:', errorData);
        showError('Error al iniciar sesión con Google: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error en Google Sign-In:', error);
      showError('Error de conexión con Google');
    }
  };

  const signInWithGoogle = () => {
    if (isGoogleLoaded) {
      try {
        // Usar prompt() directamente para una experiencia más limpia
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Si el prompt no se muestra, mostrar mensaje informativo
            console.warn('Google Sign-In popup fue bloqueado o no se pudo mostrar');
            showError('Por favor, verifica que los popups estén habilitados para este sitio');
          }
        });
      } catch (error) {
        console.error('Error al mostrar Google Sign-In:', error);
        showError('Error al inicializar Google Sign-In. Verifica la configuración del dominio.');
      }
    } else {
      console.error('Google Sign-In no está cargado');
      showError('Google Sign-In no se ha cargado correctamente');
    }
  };

  return {
    isGoogleLoaded,
    signInWithGoogle
  };
};

export default useGoogleAuth;