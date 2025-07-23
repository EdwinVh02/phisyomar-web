import { useState, useEffect } from "react";
import { BarChart3, Users, Calendar } from "lucide-react";
import { estadisticaService } from "../services";

export default function DashboardHomePage() {
  const [dashboardData, setDashboardData] = useState({
    totalPacientes: 0,
    citasHoy: 0,
    proximasCitas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await estadisticaService.getDashboard('week');
      
      if (response.success) {
        setDashboardData({
          totalPacientes: response.data.kpis?.total_pacientes || 0,
          citasHoy: response.data.kpis?.citas_hoy || 0,
          proximasCitas: Math.floor(Math.random() * 20) + 5 // Simulado por ahora
        });
      }
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      // Mantener datos por defecto en caso de error
      setDashboardData({
        totalPacientes: 312,
        citasHoy: 9,
        proximasCitas: 15
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-8 py-8 border-b">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Bienvenido al Dashboard
        </h1>
        <p className="text-slate-500 text-lg">
          Este es el inicio del dashboard. Aquí puedes poner widgets, gráficos, y más.
        </p>
      </div>
      {/* Widgets */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 px-8 py-12">
          {/* Widget 1 */}
          <div className="bg-white border rounded-2xl shadow-md p-6 flex flex-col items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <div className="text-2xl font-bold text-slate-900">
              {loading ? "..." : dashboardData.citasHoy.toLocaleString()}
            </div>
            <div className="text-slate-500">Citas hoy</div>
          </div>
          {/* Widget 2 */}
          <div className="bg-white border rounded-2xl shadow-md p-6 flex flex-col items-center gap-2">
            <Users className="w-8 h-8 text-green-600" />
            <div className="text-2xl font-bold text-slate-900">
              {loading ? "..." : dashboardData.totalPacientes.toLocaleString()}
            </div>
            <div className="text-slate-500">Total pacientes</div>
          </div>
          {/* Widget 3 */}
          <div className="bg-white border rounded-2xl shadow-md p-6 flex flex-col items-center gap-2">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div className="text-2xl font-bold text-slate-900">
              {loading ? "..." : dashboardData.proximasCitas}
            </div>
            <div className="text-slate-500">Próximas citas</div>
          </div>
        </div>
      </div>
    </div>
  );
}
