import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Users, Calendar, Stethoscope, FileText,
  BarChart3, Settings, Home, ChevronLeft, ChevronRight, LogOut,
  User, UserPlus, CreditCard, Star, HelpCircle
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { logoutUser } from "../api/auth";

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuthStore();

  // Configurar items del sidebar según el rol
  const getSidebarItems = () => {
    const basePath = hasRole(1) ? '/admin' : 
                    hasRole(2) ? '/terapeuta' : 
                    hasRole(3) ? '/recepcionista' : '/paciente';

    const commonItems = [
      { title: "Inicio", icon: Home, path: basePath }
    ];

    if (hasRole(1)) { // Administrador
      return [
        ...commonItems,
        { title: "Usuarios", icon: Users, path: `${basePath}/usuarios` },
        { title: "Pacientes", icon: User, path: `${basePath}/pacientes` },
        { title: "Citas", icon: Calendar, path: `${basePath}/citas` }
      ];
    } else if (hasRole(2)) { // Terapeuta
      return [
        ...commonItems,
        { title: "Mis Citas", icon: Calendar, path: `${basePath}/citas` }
      ];
    } else if (hasRole(3)) { // Recepcionista
      return [
        ...commonItems,
        { title: "Pacientes", icon: User, path: `${basePath}/pacientes` },
        { title: "Citas", icon: Calendar, path: `${basePath}/citas` }
      ];
    } else if (hasRole(4)) { // Paciente
      return [
        ...commonItems,
        { title: "Mis Citas", icon: Calendar, path: `${basePath}/mis-citas` },
        { title: "Agendar Cita", icon: UserPlus, path: `${basePath}/agendar-cita` },
        { title: "Mi Perfil", icon: User, path: `${basePath}/perfil` },
        { title: "Historial Médico", icon: FileText, path: `${basePath}/historial` },
        { title: "Pagos y Facturación", icon: CreditCard, path: `${basePath}/pagos` },
        { title: "Encuestas de Satisfacción", icon: Star, path: `${basePath}/encuestas` },
        { title: "Ayuda / Soporte", icon: HelpCircle, path: `${basePath}/ayuda` }
      ];
    }

    return commonItems;
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

  const sidebarItems = getSidebarItems();

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
    <div className={`fixed inset-y-0 left-0 z-50 ${collapsed ? 'w-20' : 'w-64'} bg-white/80 border-r border-white/20 shadow-xl transition-all duration-300`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-800">ClinicPro</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors hidden lg:block"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span className="font-medium">{item.title}</span>}
              </Link>
            );
          })}
        </nav>
        {/* User Profile */}
        <div className="p-4 border-t border-white/20">
          <div className={`flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-colors ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {user?.nombre?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                  {user?.nombre} {user?.apellido_paterno}
                </p>
                <p className="text-xs text-slate-600">{getRoleName(user?.rol_id)}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 mt-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
