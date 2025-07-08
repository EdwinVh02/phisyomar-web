import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";

export default function RegistrarPage() {
  const [form, setForm] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    password: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert("¡Usuario registrado! (demo)");
    setIsLoading(false);
  };

  return (
<div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-500 to-white flex items-center justify-center p-4 relative">
      <div className="relative z-10 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Crear Cuenta
            </h1>
            <p className="text-white/70">
              Únete a nuestra comunidad
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative flex items-center">
              <User className="absolute left-4 text-white/60 z-10" size={18} />
              <input
                name="nombre"
                type="text"
                placeholder="Nombre(s)"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-blue-400 focus:bg-white/10 transition-all duration-300 outline-none"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                name="apellidoPaterno"
                type="text"
                placeholder="Apellido paterno"
                className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-blue-400 focus:bg-white/10 transition-all duration-300 outline-none"
                value={form.apellidoPaterno}
                onChange={handleChange}
                required
              />
              <input
                name="apellidoMaterno"
                type="text"
                placeholder="Apellido materno"
                className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-blue-400 focus:bg-white/10 transition-all duration-300 outline-none"
                value={form.apellidoMaterno}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 text-white/60 z-10" size={18} />
              <input
                name="correo"
                type="email"
                placeholder="Correo electrónico"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-blue-400 focus:bg-white/10 transition-all duration-300 outline-none"
                value={form.correo}
                onChange={handleChange}
                required
              />
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 text-white/60 z-10" size={18} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/60 focus:border-blue-400 focus:bg-white/10 transition-all duration-300 outline-none"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-white/60 hover:text-white transition-colors z-10"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-500 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Registrando...
                </div>
              ) : (
                "Crear mi cuenta"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
