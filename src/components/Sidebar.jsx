import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";
import {
  Users, Calendar, Stethoscope, FileText,
  BarChart3, Settings, Home, ChevronLeft, ChevronRight, LogOut,
  User, UserPlus, CreditCard, Star, HelpCircle, Shield,
  Building2, DollarSign, Clock, Database, UserCheck, Activity,
  FolderOpen, BookOpen
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
        // Sección de Gestión de Usuarios
        { title: "Usuarios", icon: Users, path: `${basePath}/usuarios`, section: "users" },
        { title: "Terapeutas", icon: UserCheck, path: `${basePath}/terapeutas`, section: "users" },
        { title: "Recepcionistas", icon: Shield, path: `${basePath}/recepcionistas`, section: "users" },
        { title: "Pacientes", icon: User, path: `${basePath}/pacientes`, section: "users" },
        // Sección Operativa
        { title: "Citas", icon: Calendar, path: `${basePath}/citas`, section: "operations" },
        { title: "Clínicas", icon: Building2, path: `${basePath}/clinicas`, section: "operations" },
        { title: "Historiales", icon: BookOpen, path: `${basePath}/historiales`, section: "operations" },
        // Sección Financiera
        { title: "Pagos", icon: DollarSign, path: `${basePath}/pagos`, section: "finance" },
        // Sección Analytics
        { title: "Estadísticas", icon: BarChart3, path: `${basePath}/estadisticas`, section: "analytics" },
        { title: "Bitácoras", icon: Activity, path: `${basePath}/bitacoras`, section: "analytics" },
        // Sección Sistema
        { title: "Base de Datos", icon: Database, path: `${basePath}/database`, section: "system" },
        { title: "Configuración", icon: Settings, path: `${basePath}/configuracion`, section: "system" }
      ];
    } else if (hasRole(2)) { // Terapeuta
      return [
        ...commonItems,
        { title: "Mis Pacientes", icon: Users, path: `${basePath}/pacientes` },
        { title: "Mis Citas", icon: Calendar, path: `${basePath}/citas` },
        { title: "Estadísticas", icon: FileText, path: `${basePath}/estadisticas` }
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

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      logout();
      navigate('/login');
    }
  }, [logout, navigate]);

  const sidebarItems = useMemo(() => getSidebarItems(), [user?.rol_id]);

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
    <div className={`fixed inset-y-0 left-0 z-50 ${collapsed ? 'w-20' : 'w-72'} bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-xl transition-all duration-300`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200/60">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  PhisyoMar
                </span>
                <p className="text-xs text-slate-500 font-medium">Sistema Médico</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Stethoscope className="w-6 h-6 text-white" />
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
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {(() => {
            const items = sidebarItems;
            let currentSection = null;
            const sections = {
              users: { title: "Gestión de Usuarios", color: "blue" },
              operations: { title: "Operaciones", color: "green" },
              finance: { title: "Finanzas", color: "yellow" },
              analytics: { title: "Analytics", color: "purple" },
              system: { title: "Sistema", color: "gray" }
            };

            return items.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const showSectionHeader = item.section && item.section !== currentSection;
              
              if (showSectionHeader) {
                currentSection = item.section;
              }

              return (
                <div key={item.path}>
                  {showSectionHeader && !collapsed && (
                    <div className="px-3 py-2 mt-6 mb-2">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {sections[item.section]?.title}
                      </h3>
                    </div>
                  )}
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-600 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:text-slate-800'
                    }`}
                  >
                    <div className={`relative ${
                      isActive 
                        ? 'text-white' 
                        : 'text-slate-500 group-hover:text-slate-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                      {isActive && (
                        <div className="absolute inset-0 bg-white/20 rounded-lg animate-pulse"></div>
                      )}
                    </div>
                    {!collapsed && (
                      <span className={`font-medium transition-colors ${
                        isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-800'
                      }`}>
                        {item.title}
                      </span>
                    )}
                    {isActive && !collapsed && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </Link>
                </div>
              );
            });
          })()}
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
