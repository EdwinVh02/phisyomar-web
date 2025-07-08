import { Link, useLocation } from "react-router-dom";
import {
  Users, Calendar, Stethoscope, FileText,
  BarChart3, Settings, Home, ChevronLeft, ChevronRight, LogOut
} from "lucide-react";
import { sidebarItems } from "./sidebarItems";

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation();

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
              DR
            </div>
            {!collapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">Dr. Rodriguez</p>
                <p className="text-xs text-slate-600">Administrador</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button className="w-full flex items-center gap-3 px-3 py-2 mt-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
