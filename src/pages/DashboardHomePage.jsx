import { BarChart3, Users, Calendar } from "lucide-react";

export default function DashboardHomePage() {
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
            <div className="text-2xl font-bold text-slate-900">1,245</div>
            <div className="text-slate-500">Visitas hoy</div>
          </div>
          {/* Widget 2 */}
          <div className="bg-white border rounded-2xl shadow-md p-6 flex flex-col items-center gap-2">
            <Users className="w-8 h-8 text-green-600" />
            <div className="text-2xl font-bold text-slate-900">312</div>
            <div className="text-slate-500">Usuarios activos</div>
          </div>
          {/* Widget 3 */}
          <div className="bg-white border rounded-2xl shadow-md p-6 flex flex-col items-center gap-2">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div className="text-2xl font-bold text-slate-900">9</div>
            <div className="text-slate-500">Citas próximas</div>
          </div>
        </div>
      </div>
    </div>
  );
}
