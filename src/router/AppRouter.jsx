import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import LoginPage from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import DashboardHomePage from "../pages/DashboardHomePage";
import AdminHomePage from "../pages/AdminHomePage";
import TerapeutaHomePage from "../pages/TerapeutaHomePage";
import TerapeutaCitas from "../pages/TerapeutaCitas";
import RecepcionistaHomePage from "../pages/RecepcionistaHomePage";
import UsuariosPage from "../pages/UsuariosPage";
import PacientesPage from "../pages/PacientesPage";
import TerapeutasPage from "../pages/TerapeutasPage";
import RecepcionistasPage from "../pages/RecepcionistasPage";
import ClinicasPage from "../pages/ClinicasPage";
import EstadisticasPage from "../pages/EstadisticasPage";
import PagosPage from "../pages/PagosPage";
import HistorialesPage from "../pages/HistorialesPage";
import BitacorasPage from "../pages/BitacorasPage";
import DatabasePage from "../pages/DatabasePage";
import ConfiguracionPage from "../pages/ConfiguracionPage";
import CitasPage from "../pages/Citas";
import RegistrarPage from "../pages/Registrar";
import HomePage from "../pages/HomePage";
import Agendarcita from "../pages/AgendarCitaPaciente";
import MisCitasPage from "../pages/MisCitas";
import PerfilPaciente from "../pages/PerfilPaciente";
import DetalleCita from "../pages/DetalleCita";
import HistorialMedico from "../pages/HistorialMedico";
import PagosFacturacion from "../pages/PagosFacturacion";
import EncuestasSatisfaccion from "../pages/EncuestasSatisfaccion";
import AyudaSoporte from "../pages/AyudaSoporte";
import UnauthorizedPage from "../pages/Unauthorized";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas con navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registrar" element={<RegistrarPage />} />
        </Route>

        {/* Páginas públicas SIN navbar */}
        <Route path="/" element={<HomePage />} />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Rutas protegidas para ADMINISTRADOR */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminHomePage />} />
          <Route path="usuarios" element={<UsuariosPage />} />
          <Route path="terapeutas" element={<TerapeutasPage />} />
          <Route path="recepcionistas" element={<RecepcionistasPage />} />
          <Route path="pacientes" element={<PacientesPage />} />
          <Route path="citas" element={<CitasPage />} />
          <Route path="clinicas" element={<ClinicasPage />} />
          <Route path="estadisticas" element={<EstadisticasPage />} />
          <Route path="pagos" element={<PagosPage />} />
          <Route path="historiales" element={<HistorialesPage />} />
          <Route path="bitacoras" element={<BitacorasPage />} />
          <Route path="database" element={<DatabasePage />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
        </Route>

        {/* Rutas protegidas para TERAPEUTA */}
        <Route
          path="/terapeuta"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<TerapeutaHomePage />} />
          <Route path="pacientes" element={<TerapeutaHomePage />} />
          <Route path="estadisticas" element={<TerapeutaHomePage />} />
          <Route path="detalle-paciente/:id" element={<TerapeutaHomePage />} />
          <Route path="citas" element={<TerapeutaCitas />} />
        </Route>

        {/* Rutas protegidas para RECEPCIONISTA */}
        <Route
          path="/recepcionista"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<RecepcionistaHomePage />} />
          <Route path="pacientes" element={<PacientesPage />} />
          <Route path="citas" element={<CitasPage />} />
        </Route>

        {/* Rutas protegidas para PACIENTE */}
        <Route
          path="/paciente"
          element={
            <ProtectedRoute allowedRoles={[4]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<PerfilPaciente />} />
          <Route path="perfil" element={<PerfilPaciente />} />
          <Route path="mis-citas" element={<MisCitasPage />} />
          <Route path="cita/:id" element={<DetalleCita />} />
          <Route path="agendar-cita" element={<Agendarcita />} />
          <Route path="historial" element={<HistorialMedico />} />
          <Route path="pagos" element={<PagosFacturacion />} />
          <Route path="encuestas" element={<EncuestasSatisfaccion />} />
          <Route path="ayuda" element={<AyudaSoporte />} />
        </Route>

        {/* Dashboard genérico (redirige según rol) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHomePage />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
