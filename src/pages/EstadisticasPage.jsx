import { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Calendar, DollarSign, 
  Activity, Clock, Target, Filter, Download
} from 'lucide-react';
import { estadisticaService } from '../services';
import { useToast } from '../hooks/useToast';
import { useAsyncOperation } from '../hooks/useAsyncOperation';
import { ToastContainer } from '../components/Toast';
import { InlineLoading } from '../components/LoadingSpinner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function EstadisticasPage() {
  const [timeRange, setTimeRange] = useState('month'); // week, month, year
  const [estadisticas, setEstadisticas] = useState({});
  const { toasts, removeToast } = useToast();
  const { loading, execute } = useAsyncOperation();

  useEffect(() => {
    fetchEstadisticas();
  }, [timeRange]);

  const fetchEstadisticas = async () => {
    const result = await execute(
      () => estadisticaService.getDashboard(timeRange),
      {
        errorMessage: 'Error al cargar estadísticas del dashboard',
        showErrorToast: true
      }
    );
    
    if (result.success) {
      setEstadisticas(result.data);
    } else {
      // Fallback a datos simulados en caso de error
      setEstadisticas({
        kpis: {
          total_pacientes: 1247,
          citas_hoy: 23,
          ingresos_mes: 125000,
          terapeutas_activos: 15,
          tendencias: {
            pacientes: 12.5,
            citas: -3.2,
            ingresos: 8.7,
            terapeutas: 0
          }
        },
        citas_por_mes: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          data: [120, 135, 180, 165, 220, 240, 285, 295, 310, 275, 190, 160]
        },
        ingresos_por_mes: {
          labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
          data: [45000, 52000, 68000, 61000, 78000, 85000, 92000, 98000, 105000, 89000, 67000, 58000]
        },
        especialidades: {
          labels: ['Fisioterapia General', 'Rehabilitación', 'Masoterapia', 'Terapia Deportiva', 'Neurológica'],
          data: [450, 320, 280, 180, 120]
        },
        horarios_pico: {
          labels: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
          data: [15, 25, 35, 42, 38, 20, 28, 45, 50, 48, 35, 22]
        }
      });
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  if (loading) {
    return <InlineLoading message="Cargando estadísticas..." />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Estadísticas y Analytics</h1>
          <p className="text-gray-600">Panel de métricas y análisis del negocio</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="year">Este año</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Pacientes',
            value: estadisticas.kpis?.total_pacientes,
            trend: estadisticas.kpis?.tendencias?.pacientes,
            icon: Users,
            color: 'blue',
            format: 'number'
          },
          {
            title: 'Citas Hoy',
            value: estadisticas.kpis?.citas_hoy,
            trend: estadisticas.kpis?.tendencias?.citas,
            icon: Calendar,
            color: 'green',
            format: 'number'
          },
          {
            title: 'Ingresos del Mes',
            value: estadisticas.kpis?.ingresos_mes,
            trend: estadisticas.kpis?.tendencias?.ingresos,
            icon: DollarSign,
            color: 'yellow',
            format: 'currency'
          },
          {
            title: 'Terapeutas Activos',
            value: estadisticas.kpis?.terapeutas_activos,
            trend: estadisticas.kpis?.tendencias?.terapeutas,
            icon: Activity,
            color: 'purple',
            format: 'number'
          }
        ].map((kpi, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {kpi.format === 'currency' 
                    ? `$${kpi.value?.toLocaleString()}` 
                    : kpi.value?.toLocaleString()
                  }
                </p>
                {kpi.trend !== undefined && kpi.trend !== 0 && (
                  <div className={`flex items-center mt-2 ${kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendingUp className={`w-4 h-4 mr-1 ${kpi.trend < 0 ? 'rotate-180' : ''}`} />
                    <span className="text-sm font-medium">{Math.abs(kpi.trend)}%</span>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-lg bg-${kpi.color}-100`}>
                <kpi.icon className={`w-6 h-6 text-${kpi.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Citas por Mes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Citas por Mes</h3>
          <div className="h-80">
            <Bar
              data={{
                labels: estadisticas.citas_por_mes?.labels || [],
                datasets: [
                  {
                    label: 'Citas',
                    data: estadisticas.citas_por_mes?.data || [],
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Ingresos por Mes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Mes</h3>
          <div className="h-80">
            <Line
              data={{
                labels: estadisticas.ingresos_por_mes?.labels || [],
                datasets: [
                  {
                    label: 'Ingresos ($)',
                    data: estadisticas.ingresos_por_mes?.data || [],
                    borderColor: 'rgba(34, 197, 94, 1)',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    tension: 0.4,
                    fill: true,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>

        {/* Especialidades Más Solicitadas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Especialidades Más Solicitadas</h3>
          <div className="h-80">
            <Doughnut
              data={{
                labels: estadisticas.especialidades?.labels || [],
                datasets: [
                  {
                    data: estadisticas.especialidades?.data || [],
                    backgroundColor: [
                      'rgba(59, 130, 246, 0.8)',
                      'rgba(34, 197, 94, 0.8)',
                      'rgba(251, 191, 36, 0.8)',
                      'rgba(168, 85, 247, 0.8)',
                      'rgba(239, 68, 68, 0.8)',
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                  },
                ],
              }}
              options={doughnutOptions}
            />
          </div>
        </div>

        {/* Horarios Pico */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Horarios con Más Demanda</h3>
          <div className="h-80">
            <Bar
              data={{
                labels: estadisticas.horarios_pico?.labels || [],
                datasets: [
                  {
                    label: 'Citas por Hora',
                    data: estadisticas.horarios_pico?.data || [],
                    backgroundColor: 'rgba(168, 85, 247, 0.8)',
                    borderColor: 'rgba(168, 85, 247, 1)',
                    borderWidth: 1,
                  },
                ],
              }}
              options={chartOptions}
            />
          </div>
        </div>
      </div>

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Eficiencia Operativa</h3>
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tasa de Ocupación</span>
              <span className="font-semibold">{estadisticas.metricas_operativas?.tasa_ocupacion || 87}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${estadisticas.metricas_operativas?.tasa_ocupacion || 87}%` }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tiempo Promedio de Sesión</span>
              <span className="font-semibold">{estadisticas.metricas_operativas?.tiempo_promedio_sesion || 45} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Satisfacción del Cliente</span>
              <span className="font-semibold">{estadisticas.metricas_operativas?.satisfaccion_cliente || 4.8}/5</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Rendimiento Financiero</h3>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Ingreso por Paciente</span>
              <span className="font-semibold">${estadisticas.rendimiento_financiero?.ingreso_por_paciente?.toLocaleString() || '1,245'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Margen de Ganancia</span>
              <span className="font-semibold text-green-600">{estadisticas.rendimiento_financiero?.margen_ganancia || 32}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pagos Pendientes</span>
              <span className="font-semibold text-yellow-600">${estadisticas.rendimiento_financiero?.pagos_pendientes?.toLocaleString() || '28,500'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Objetivo Mensual</span>
              <span className="font-semibold">{estadisticas.rendimiento_financiero?.objetivo_mensual || 78}% alcanzado</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Personal</h3>
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Terapeutas Disponibles</span>
              <span className="font-semibold">12/15</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Promedio de Pacientes/Día</span>
              <span className="font-semibold">8.5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Horas Trabajadas/Semana</span>
              <span className="font-semibold">42h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Eficiencia del Personal</span>
              <span className="font-semibold text-green-600">92%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}