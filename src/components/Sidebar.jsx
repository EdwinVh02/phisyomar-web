import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useCallback } from "react";
import {
  Users, Calendar, Stethoscope, FileText,
  BarChart3, Settings, Home, ChevronLeft, ChevronRight, LogOut,
  User, UserPlus, CreditCard, Star, HelpCircle, Shield,
  Building2, DollarSign, Clock, Database, UserCheck, Activity,
  FolderOpen, BookOpen, UserCog
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { logoutUser } from "../api/auth";

// Estilos CSS en línea para el scrollbar personalizado
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(71, 85, 105, 0.1);
    border-radius: 2px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 2px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.5);
  }
`;

export default function Sidebar({ collapsed = true, setCollapsed }) {
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
        { title: "Gestión de Roles", icon: UserCog, path: `${basePath}/roles`, section: "system" },
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
    <>
      {/* Estilos CSS dinámicos */}
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      
      {/* Overlay para móvil */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
      
      {/* Botón flotante para expandir (solo visible cuando está contraído) */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="fixed top-4 left-20 z-50 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group lg:hidden"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
        </button>
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 ${collapsed ? 'w-16 hover:w-72' : 'w-72'} bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-all duration-300 ease-in-out group`}
        onMouseEnter={() => collapsed && window.innerWidth >= 1024 && setCollapsed(false)}
        onMouseLeave={() => !collapsed && window.innerWidth >= 1024 && setCollapsed(true)}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center ${collapsed ? 'justify-center p-4' : 'justify-between p-6'} border-b border-slate-700/50`}>
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
              <div className={`${collapsed ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
                   onClick={() => setCollapsed(!collapsed)}>
                <Stethoscope className={`${collapsed ? 'w-4 h-4' : 'w-6 h-6'} text-white transition-all duration-300`} />
              </div>
              {!collapsed && (
                <div className="overflow-hidden">
                  <span className="text-xl font-bold text-white">
                    PhisyoMar
                  </span>
                  <p className="text-xs text-slate-300 font-medium">Sistema Médico</p>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-200 group"
              >
                <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-white" />
              </button>
            )}
          </div>
          
          {/* Navigation */}
        <nav className={`flex-1 ${collapsed ? 'p-2' : 'p-4'} space-y-1 overflow-y-auto custom-scrollbar`}>
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

            return items.map((item) => {
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
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {sections[item.section]?.title}
                      </h3>
                    </div>
                  )}
                  {showSectionHeader && collapsed && (
                    <div className="w-full h-px bg-slate-600 my-3 mx-2"></div>
                  )}
                  <Link
                    to={item.path}
                    className={`flex items-center ${collapsed ? 'justify-center px-2 py-3 mx-1' : 'gap-3 px-3 py-2.5'} rounded-xl transition-all duration-300 w-full group relative ${
                      isActive
                        ? collapsed 
                          ? 'bg-blue-500 shadow-lg scale-105'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : collapsed
                        ? 'text-slate-400 hover:bg-slate-700 hover:text-white hover:scale-105'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                    title={collapsed ? item.title : ''}
                  >
                    <div className={`flex items-center justify-center ${collapsed ? 'w-10 h-10 rounded-xl' : ''} transition-all duration-300`}>
                      <Icon className={`${collapsed ? 'w-6 h-6' : 'w-5 h-5'} ${
                        isActive 
                          ? 'text-white'
                          : 'transition-colors duration-300'
                      }`} />
                    </div>
                    {!collapsed && (
                      <span className={`font-medium text-sm ${
                        isActive ? 'text-blue-700' : 'text-slate-700 group-hover:text-slate-900'
                      } transition-colors duration-200`}>
                        {item.title}
                      </span>
                    )}
                    {/* Tooltip elegante para modo compacto */}
                    {collapsed && (
                      <div className="absolute left-full ml-6 px-4 py-2 bg-slate-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-2xl border border-slate-700">
                        <div className="font-medium">{item.title}</div>
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 w-4 h-4 bg-slate-900 border-l border-t border-slate-700 rotate-45"></div>
                      </div>
                    )}
                  </Link>
                </div>
              );
            });
          })()}
        </nav>
        {/* User Profile */}
        <div className={`${collapsed ? 'p-2' : 'p-4'} border-t border-slate-700/50`}>
          <div className={`flex items-center gap-3 ${collapsed ? 'p-2 justify-center' : 'p-3'} rounded-xl hover:bg-slate-700 transition-all duration-300 group relative cursor-pointer`}
               onClick={() => !collapsed && setCollapsed(false)}>
            <div className={`${collapsed ? 'w-10 h-10' : 'w-9 h-9'} bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 ring-2 ring-blue-400/20`}>
              {user?.nombre?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.nombre} {user?.apellido_paterno}
                </p>
                <p className="text-xs text-slate-300 truncate">{getRoleName(user?.rol_id)}</p>
              </div>
            )}
            {/* Tooltip premium para perfil */}
            {collapsed && (
              <div className="absolute left-full ml-6 px-4 py-3 bg-slate-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-2xl border border-slate-700">
                <div className="font-bold text-blue-400">{user?.nombre} {user?.apellido_paterno}</div>
                <div className="text-xs text-slate-300 mt-1">{getRoleName(user?.rol_id)}</div>
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 w-4 h-4 bg-slate-900 border-l border-t border-slate-700 rotate-45"></div>
              </div>
            )}
          </div>
          {!collapsed && (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 mt-3 text-slate-300 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300 text-sm group"
            >
              <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          )}
          {collapsed && (
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center p-3 mt-3 text-slate-400 hover:bg-red-600 hover:text-white rounded-xl transition-all duration-300 group relative hover:scale-105"
              title="Cerrar Sesión"
            >
              <LogOut className="w-6 h-6 group-hover:rotate-12 transition-all duration-300" />
              {/* Tooltip premium */}
              <div className="absolute left-full ml-6 px-4 py-2 bg-slate-900 text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50 shadow-2xl border border-slate-700">
                <span className="font-medium text-red-400">Cerrar Sesión</span>
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 w-4 h-4 bg-slate-900 border-l border-t border-slate-700 rotate-45"></div>
              </div>
            </button>
          )}
        </div> {/* Cierre de perfil de usuario */}
      </div> {/* Cierre de flex flex-col h-full */}
    </div> {/* Cierre de fixed sidebar */}
    </>
  );
}
