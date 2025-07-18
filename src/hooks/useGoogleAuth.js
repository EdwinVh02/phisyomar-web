import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const useGoogleAuth = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el script de Google se ha cargado
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts) {
        setIsGoogleLoaded(true);
        
        // Inicializar Google Identity Services con configuración para desarrollo
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
          use_fedcm_for_prompt: false // Deshabilitar FedCM para desarrollo local
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
      const backendResponse = await fetch('http://localhost:8000/api/auth/google', {
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
        alert('Error al iniciar sesión con Google: ' + (errorData.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error en Google Sign-In:', error);
      alert('Error de conexión con Google');
    }
  };

  const signInWithGoogle = () => {
    if (isGoogleLoaded) {
      // Usar renderButton en lugar de prompt() para evitar problemas con FedCM
      const buttonDiv = document.createElement('div');
      buttonDiv.style.position = 'fixed';
      buttonDiv.style.top = '50%';
      buttonDiv.style.left = '50%';
      buttonDiv.style.transform = 'translate(-50%, -50%)';
      buttonDiv.style.zIndex = '9999';
      buttonDiv.style.backgroundColor = 'white';
      buttonDiv.style.padding = '20px';
      buttonDiv.style.borderRadius = '10px';
      buttonDiv.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      
      document.body.appendChild(buttonDiv);
      
      window.google.accounts.id.renderButton(buttonDiv, {
        theme: 'filled_blue',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '300'
      });
      
      // Agregar botón de cerrar
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '×';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '5px';
      closeButton.style.right = '10px';
      closeButton.style.background = 'none';
      closeButton.style.border = 'none';
      closeButton.style.fontSize = '20px';
      closeButton.style.cursor = 'pointer';
      closeButton.onclick = () => {
        document.body.removeChild(buttonDiv);
      };
      
      buttonDiv.appendChild(closeButton);
      
      // Cerrar automáticamente después de 10 segundos
      setTimeout(() => {
        if (document.body.contains(buttonDiv)) {
          document.body.removeChild(buttonDiv);
        }
      }, 10000);
    } else {
      console.error('Google Sign-In no está cargado');
    }
  };

  return {
    isGoogleLoaded,
    signInWithGoogle
  };
};

export default useGoogleAuth;