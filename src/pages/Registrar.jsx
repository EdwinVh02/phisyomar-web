import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Stethoscope,
} from "lucide-react";
import { registerUsuario } from "../services/usuarioService";
import { useToast } from "../hooks/useToast";

export default function RegistrarPage() {
  const [form, setForm] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo_electronico: "",
    contraseña: "",
    contraseña_confirmation: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
    sexo: "",
    curp: "",
    ocupacion: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const { showSuccess } = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await registerUsuario(form);
      setSuccess(true);
      showSuccess("¡Usuario registrado correctamente!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl flex w-full max-w-5xl overflow-hidden">
        {/* Izquierda: Ilustración + info */}
        <div className="w-1/2 bg-blue-100 p-10 flex flex-col items-center justify-center">
          <div className="mb-8">
            <div className="w-60 h-60 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
              <UserPlus className="w-32 h-32 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
            Únete a Nuestro Centro
          </h2>
          <p className="text-gray-500 text-center max-w-xs">
            Crea tu cuenta y accede a nuestros servicios de fisioterapia profesional
          </p>
          <div className="flex items-center mt-6 space-x-2">
            <span className="w-2 h-2 bg-blue-200 rounded-full"></span>
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
            <span className="w-2 h-2 bg-blue-200 rounded-full"></span>
          </div>
        </div>

        {/* Derecha: Formulario de registro */}
        <div className="w-1/2 p-8 overflow-y-auto max-h-screen">
          <div className="flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-gray-700 tracking-tight">
              <span className="font-serif">PHYSIO</span>
            </span>
            <span className="ml-2 text-2xl text-blue-600 font-light tracking-tight">
              MAR
            </span>
          </div>

          {/* Error/Success messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm mb-4">
              ¡Registro exitoso!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="text-gray-700 text-sm mb-1 block">Nombre completo</label>
              <input
                name="nombre"
                type="text"
                placeholder="Nombre(s)"
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>

            {/* Apellidos */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 text-sm mb-1 block">Apellido paterno</label>
                <input
                  name="apellido_paterno"
                  type="text"
                  placeholder="Apellido paterno"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  value={form.apellido_paterno}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-gray-700 text-sm mb-1 block">Apellido materno</label>
                <input
                  name="apellido_materno"
                  type="text"
                  placeholder="Apellido materno"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  value={form.apellido_materno}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-700 text-sm mb-1 block">Correo electrónico</label>
              <input
                name="correo_electronico"
                type="email"
                placeholder="tu@email.com"
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                value={form.correo_electronico}
                onChange={handleChange}
                required
              />
            </div>

            {/* Contraseñas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 text-sm mb-1 block">Contraseña</label>
                <div className="relative">
                  <input
                    name="contraseña"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all pr-12"
                    value={form.contraseña}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-gray-700 text-sm mb-1 block">Confirmar contraseña</label>
                <input
                  name="contraseña_confirmation"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  value={form.contraseña_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="text-gray-700 text-sm mb-1 block">Teléfono</label>
              <input
                name="telefono"
                type="tel"
                placeholder="+52 555 123 4567"
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                value={form.telefono}
                onChange={handleChange}
                required
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="text-gray-700 text-sm mb-1 block">Dirección</label>
              <input
                name="direccion"
                type="text"
                placeholder="Calle, número, colonia, ciudad"
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                value={form.direccion}
                onChange={handleChange}
              />
            </div>

            {/* Fecha de nacimiento */}
            <div>
              <label className="text-gray-700 text-sm mb-1 block">Fecha de nacimiento</label>
              <input
                name="fecha_nacimiento"
                type="date"
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                value={form.fecha_nacimiento}
                onChange={handleChange}
                required
              />
            </div>

            {/* Sexo y CURP */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 text-sm mb-1 block">Sexo</label>
                <select
                  name="sexo"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  value={form.sexo}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="text-gray-700 text-sm mb-1 block">CURP</label>
                <input
                  name="curp"
                  type="text"
                  placeholder="CURP (18 caracteres)"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                  value={form.curp}
                  onChange={handleChange}
                  maxLength={18}
                  required
                />
              </div>
            </div>

            {/* Ocupación */}
            <div>
              <label className="text-gray-700 text-sm mb-1 block">Ocupación</label>
              <input
                name="ocupacion"
                type="text"
                placeholder="Ej. Estudiante, Ingeniero, etc."
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                value={form.ocupacion}
                onChange={handleChange}
              />
            </div>

            {/* Botón de registro */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-700 text-white rounded-lg py-3 font-semibold hover:bg-blue-800 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Iniciar sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
