import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import PublicLayout from "../layouts/PublicLayout";
import LoginPage from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import HomePage from "../pages/HomePage";
import UnauthorizedPage from "../pages/Unauthorized";
import ProtectedRoute from "../components/ProtectedRoute";

// Lazy loading de páginas principales
const DashboardHomePage = lazy(() => import("../pages/DashboardHomePage"));
const AdminHomePage = lazy(() => import("../pages/AdminHomePage"));
const TerapeutaHomePage = lazy(() => import("../pages/TerapeutaHomePage"));
const TerapeutaCitas = lazy(() => import("../pages/TerapeutaCitas"));
const RecepcionistaHomePage = lazy(() => import("../pages/RecepcionistaHomePage"));
const UsuariosPage = lazy(() => import("../pages/UsuariosPage"));
const PacientesPage = lazy(() => import("../pages/PacientesPage"));
const TerapeutasPage = lazy(() => import("../pages/TerapeutasPage"));
const RecepcionistasPage = lazy(() => import("../pages/RecepcionistasPage"));
const ClinicasPage = lazy(() => import("../pages/ClinicasPage"));
const EstadisticasPage = lazy(() => import("../pages/EstadisticasPage"));
const PagosPage = lazy(() => import("../pages/PagosPage"));
const HistorialesPage = lazy(() => import("../pages/HistorialesPage"));
const BitacorasPage = lazy(() => import("../pages/BitacorasPage"));
const DatabasePage = lazy(() => import("../pages/DatabasePage"));
const ConfiguracionPage = lazy(() => import("../pages/ConfiguracionPage"));
const CitasPage = lazy(() => import("../pages/Citas"));
const RegistrarPage = lazy(() => import("../pages/Registrar"));
const Agendarcita = lazy(() => import("../pages/AgendarCitaPaciente"));
const MisCitasPage = lazy(() => import("../pages/MisCitas"));
const PerfilPaciente = lazy(() => import("../pages/PerfilPaciente"));
const DetalleCita = lazy(() => import("../pages/DetalleCita"));
const HistorialMedico = lazy(() => import("../pages/HistorialMedico"));
const PagosFacturacion = lazy(() => import("../pages/PagosFacturacion"));
const EncuestasSatisfaccion = lazy(() => import("../pages/EncuestasSatisfaccion"));
const AyudaSoporte = lazy(() => import("../pages/AyudaSoporte"));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
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
      </Suspense>
    </BrowserRouter>
  );
}
