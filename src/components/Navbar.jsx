import React, { useState, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Heart, Menu, X, User, LogOut, ChevronDown,
  Users, Calendar, FileText, BarChart3, Settings, Home,
  UserPlus, CreditCard, Star, HelpCircle, Shield,
  Building2, DollarSign, Database, UserCheck, Activity,
  BookOpen
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { logoutUser } from "../api/auth";

const Navbar = React.memo(function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, hasRole } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener elementos del menú según el rol del usuario
  const getMenuItems = () => {
    if (!user) return [];

    const basePath = hasRole(1) ? '/admin' : 
                    hasRole(2) ? '/terapeuta' : 
                    hasRole(3) ? '/recepcionista' : '/paciente';

    if (hasRole(1)) { // Administrador
      return [
        { title: "Dashboard", icon: Home, path: basePath },
        { title: "Mi Perfil", icon: User, path: `${basePath}/profile` },
        { title: "Usuarios", icon: Users, path: `${basePath}/usuarios` },
        { title: "Terapeutas", icon: UserCheck, path: `${basePath}/terapeutas` },
        { title: "Pacientes", icon: Users, path: `${basePath}/pacientes` },
        { title: "Citas", icon: Calendar, path: `${basePath}/citas` },
        { title: "Estadísticas", icon: BarChart3, path: `${basePath}/estadisticas` },
        { title: "Configuración", icon: Settings, path: `${basePath}/configuracion` }
      ];
    } else if (hasRole(2)) { // Terapeuta
      return [
        { title: "Dashboard", icon: Home, path: basePath },
        { title: "Mi Perfil", icon: User, path: `${basePath}/profile` },
        { title: "Mis Pacientes", icon: Users, path: `${basePath}/pacientes` },
        { title: "Mis Citas", icon: Calendar, path: `${basePath}/citas` },
        { title: "Estadísticas", icon: FileText, path: `${basePath}/estadisticas` }
      ];
    } else if (hasRole(3)) { // Recepcionista
      return [
        { title: "Dashboard", icon: Home, path: basePath },
        { title: "Mi Perfil", icon: User, path: `${basePath}/profile` },
        { title: "Pacientes", icon: Users, path: `${basePath}/pacientes` },
        { title: "Citas", icon: Calendar, path: `${basePath}/citas` }
      ];
    } else if (hasRole(4)) { // Paciente
      return [
        { title: "Mi Perfil", icon: User, path: `${basePath}/perfil` },
        { title: "Mis Citas", icon: Calendar, path: `${basePath}/mis-citas` },
        { title: "Agendar Cita", icon: UserPlus, path: `${basePath}/agendar-cita` },
        { title: "Historial", icon: FileText, path: `${basePath}/historial` },
        { title: "Pagos", icon: CreditCard, path: `${basePath}/pagos` },
        { title: "Encuestas", icon: Star, path: `${basePath}/encuestas` },
        { title: "Ayuda", icon: HelpCircle, path: `${basePath}/ayuda` }
      ];
    }

    return [];
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      logout();
      navigate('/login');
    }
  };

  const menuItems = useMemo(() => getMenuItems(), [user?.rol_id]);
  const isLoggedIn = !!user;

  const getRoleName = (rolId) => {
    switch (rolId) {
      case 1: return 'Administrador';
      case 2: return 'Terapeuta';
      case 3: return 'Recepcionista';
      case 4: return 'Paciente';
      default: return 'Usuario';
    }
  };

  return (
    <nav className="relative z-50 px-6 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-3 text-2xl font-bold text-white hover:text-blue-200 transition-all duration-300"
        >
          <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl shadow-lg border border-white/20">
            <Heart className="w-6 h-6 text-white" />
          </div>
          Clínica PhysioMar
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-6">
          {!isLoggedIn ? (
            // Menú público
            <>
              <Link to="/" className="text-blue-100 hover:text-white transition-colors duration-300 font-medium relative group">
                Inicio
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </Link>
              <a href="/#servicios" className="text-blue-100 hover:text-white transition-colors duration-300 font-medium relative group">
                Servicios
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="/#testimonios" className="text-blue-100 hover:text-white transition-colors duration-300 font-medium relative group">
                Testimonios
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="/#contacto" className="text-blue-100 hover:text-white transition-colors duration-300 font-medium relative group">
                Contacto
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </a>
              <Link to="/login" className="bg-white text-blue-700 px-6 py-2 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg">
                Iniciar sesión
              </Link>
              <Link to="/registrar" className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg ml-2">
                Registrarse
              </Link>
            </>
          ) : (
            // Menú de usuario autenticado
            <>
              {menuItems.slice(0, 5).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg'
                        : 'text-blue-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.title}
                  </Link>
                );
              })}
              
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">
                      {user?.nombre} {user?.apellido_paterno}
                    </p>
                    <p className="text-xs text-blue-200">{getRoleName(user?.rol_id)}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-blue-200" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.nombre} {user?.apellido_paterno}
                      </p>
                      <p className="text-xs text-gray-500">{user?.correo_electronico}</p>
                      <p className="text-xs text-blue-600 font-medium">{getRoleName(user?.rol_id)}</p>
                    </div>
                    
                    {menuItems.length > 5 && (
                      <div className="py-2 border-b border-gray-100">
                        <p className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          Menú Adicional
                        </p>
                        {menuItems.slice(5).map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <Icon className="w-4 h-4 text-gray-500" />
                              {item.title}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-blue-800/95 backdrop-blur-xl p-6 space-y-4 shadow-2xl border-t border-white/20">
          {!isLoggedIn ? (
            // Menú móvil público
            <>
              <Link to="/" className="block text-blue-100 hover:text-white transition-colors duration-300 py-2">Inicio</Link>
              <a href="/#servicios" className="block text-blue-100 hover:text-white transition-colors duration-300 py-2">Servicios</a>
              <a href="/#testimonios" className="block text-blue-100 hover:text-white transition-colors duration-300 py-2">Testimonios</a>
              <a href="/#contacto" className="block text-blue-100 hover:text-white transition-colors duration-300 py-2">Contacto</a>
              <Link to="/login" className="block w-full bg-white text-blue-700 px-6 py-3 rounded-full hover:bg-blue-50 transition-all duration-300 font-semibold text-center shadow-lg mt-4">
                Iniciar sesión
              </Link>
              <Link to="/registrar" className="block w-full bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-all duration-300 font-semibold text-center shadow-lg mt-2">
                Registrarse
              </Link>
            </>
          ) : (
            // Menú móvil de usuario autenticado
            <>
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user?.nombre} {user?.apellido_paterno}
                  </p>
                  <p className="text-xs text-blue-200">{getRoleName(user?.rol_id)}</p>
                </div>
              </div>
              
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-blue-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.title}
                  </Link>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-3 text-red-300 hover:text-red-200 hover:bg-red-500/20 rounded-lg transition-colors duration-300 mt-4 border-t border-white/20 pt-4"
              >
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
});

export default Navbar;
