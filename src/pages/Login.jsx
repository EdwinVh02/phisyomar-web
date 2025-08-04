import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Stethoscope } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { loginUser } from "../api/auth";
import useGoogleAuth from "../hooks/useGoogleAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuthStore();
  const { isGoogleLoaded, signInWithGoogle } = useGoogleAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Obtener el rol_id de la estructura correcta
      const roleId = user.user?.rol_id || user.rol_id;
      
      // Redirigir usuario ya autenticado según su rol
      switch (roleId) {
        case 1: // Administrador
          navigate('/admin');
          break;
        case 2: // Terapeuta
          navigate('/terapeuta');
          break;
        case 3: // Recepcionista
          navigate('/recepcionista');
          break;
        case 4: // Paciente
          navigate('/paciente');
          break;
        default:
          navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { usuario, token } = await loginUser(email, password);
      
      login(usuario, token);
      
      // Obtener el rol_id de la estructura correcta
      const roleId = usuario.user?.rol_id || usuario.rol_id;
      
      // Redirigir según el rol del usuario
      switch (roleId) {
        case 1: // Administrador
          navigate('/admin');
          break;
        case 2: // Terapeuta
          navigate('/terapeuta');
          break;
        case 3: // Recepcionista
          navigate('/recepcionista');
          break;
        case 4: // Paciente
          navigate('/paciente');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white rounded-3xl shadow-xl flex w-full max-w-4xl overflow-hidden">
        {/* Izquierda: Ilustración + info */}
        <div className="w-1/2 bg-blue-100 p-10 flex flex-col items-center justify-center">
          <div className="mb-8">
            <div className="w-60 h-60 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
              <Stethoscope className="w-32 h-32 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            Centro de Fisioterapia
          </h2>
          <p className="text-gray-500 text-center max-w-xs">
            Accede a tu portal de salud y gestiona tus citas de fisioterapia de manera fácil y segura
          </p>
          <div className="flex items-center mt-6 space-x-2">
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="w-2 h-2 bg-blue-200 rounded-full"></span>
            <span className="w-2 h-2 bg-blue-200 rounded-full"></span>
          </div>
        </div>

        {/* Derecha: Login form */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <div className="flex items-center justify-center mb-8">
            <span className="text-3xl font-bold text-gray-700 tracking-tight">
              <span className="font-serif">PHYSIO</span>
            </span>
            <span className="ml-2 text-3xl text-blue-600 font-light tracking-tight">
              MAR
            </span>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className="text-gray-700 text-sm mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="mb-4 p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              required
            />

            <label className="text-gray-700 text-sm mb-1">Contraseña</label>
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex justify-end mb-4">
              <a href="#" className="text-blue-500 text-xs hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-700 text-white rounded-lg py-3 font-semibold hover:bg-blue-800 transition mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-2 text-gray-400 text-sm">o</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          <button 
            onClick={signInWithGoogle}
            disabled={!isGoogleLoaded}
            className="flex items-center justify-center border border-gray-300 rounded-lg py-3 w-full hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm text-gray-700">
              {isGoogleLoaded ? 'Iniciar sesión con Google' : 'Cargando Google...'}
            </span>
          </button>

          <div className="mt-6 text-center text-sm text-gray-600">
            ¿Eres nuevo?{" "}
            <a href="/registrar" className="text-blue-500 hover:underline">
              Crear una cuenta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
