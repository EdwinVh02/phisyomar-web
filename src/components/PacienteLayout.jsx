import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  FileText, 
  CreditCard, 
  Star, 
  HelpCircle,
  ChevronRight 
} from 'lucide-react';

const menuItems = [
  { path: '/paciente/mis-citas', label: 'Mis Citas', icon: Calendar },
  { path: '/paciente/perfil', label: 'Mi Perfil', icon: User },
  { path: '/paciente/historial', label: 'Historial Médico', icon: FileText },
  { path: '/paciente/pagos', label: 'Pagos y Facturación', icon: CreditCard },
  { path: '/paciente/encuestas', label: 'Encuestas de Satisfacción', icon: Star },
  { path: '/paciente/ayuda', label: 'Ayuda / Soporte', icon: HelpCircle },
];

export default function PacienteLayout({ children, title, subtitle, icon: Icon }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
              {subtitle && (
                <p className="text-blue-100 text-lg mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Menú del Paciente</h3>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <ItemIcon className="w-5 h-5" />
                      <span className="flex-1">{item.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}