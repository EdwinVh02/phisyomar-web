import React from 'react';
import { Users, Calendar, TrendingUp, Activity, RefreshCw } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminHomePage() {
  const { 
    stats, 
    citasResumen, 
    actividadReciente, 
    loading, 
    error, 
    refreshData 
  } = useDashboard();

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Formatear porcentaje
  const formatPercentage = (value) => {
    return `${Math.round(value)}%`;
  };

  // Obtener color para tipo de actividad
  const getActivityColor = (type) => {
    switch (type) {
      case 'appointment':
        return 'bg-green-500';
      case 'user':
        return 'bg-blue-500';
      case 'payment':
        return 'bg-purple-500';
      case 'auth':
        return 'bg-yellow-500';
      case 'system':
        return 'bg-gray-500';
      default:
        return 'bg-slate-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard Administrativo</h1>
          <p className="text-slate-600">Resumen general de la clínica PhisyoMar</p>
        </div>
        <button
          onClick={refreshData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Usuarios</p>
              <p className="text-3xl font-bold text-slate-900">
                {stats.totalUsuarios.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Usuarios registrados
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Citas Hoy</p>
              <p className="text-3xl font-bold text-slate-900">
                {stats.citasHoy}
              </p>
              <p className="text-xs text-blue-600 font-medium mt-1">
                {citasResumen.pendientes} pendientes
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Ingresos Mes</p>
              <p className="text-3xl font-bold text-slate-900">
                {formatCurrency(stats.ingresosMes)}
              </p>
              <p className="text-xs text-green-600 font-medium mt-1">
                Ingresos del mes actual
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Eficiencia</p>
              <p className="text-3xl font-bold text-slate-900">
                {formatPercentage(stats.eficiencia)}
              </p>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Rendimiento general
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secciones principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Resumen de Citas</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Citas Programadas</span>
              <span className="text-lg font-bold text-blue-600">{citasResumen.programadas}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Citas Completadas</span>
              <span className="text-lg font-bold text-green-600">{citasResumen.completadas}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Citas Pendientes</span>
              <span className="text-lg font-bold text-yellow-600">{citasResumen.pendientes}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Citas Canceladas</span>
              <span className="text-lg font-bold text-red-600">{citasResumen.canceladas}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {actividadReciente.length > 0 ? (
              actividadReciente.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    <p className="text-xs text-slate-500">por {activity.user}</p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No hay actividad reciente</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}