import React from 'react';
import { Users, Calendar, TrendingUp, Activity } from 'lucide-react';

export default function AdminHomePage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Administrativo</h1>
        <p className="text-gray-600">Resumen general de la clínica</p>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Pacientes</p>
              <p className="text-3xl font-bold text-gray-900">245</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Citas Hoy</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Ingresos Mes</p>
              <p className="text-3xl font-bold text-gray-900">$45,230</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Terapeutas Activos</p>
              <p className="text-3xl font-bold text-gray-900">8</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Citas por Mes</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Gráfico de citas por mes</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimas Actividades</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Nueva cita agendada - Juan Pérez</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Usuario registrado - María García</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-sm text-gray-600">Cita completada - Carlos López</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}