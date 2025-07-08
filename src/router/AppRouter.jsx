import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import LoginPage from "../pages/Login";
import Dashboard from "../pages/AdminDashboard";
import DashboardHomePage from "../pages/DashboardHomePage";
import UsuariosPage from "../pages/UsuariosPage";
import CitasPage from "../pages/Citas";
import RegistrarPage from "../pages/Registrar";
import HomePage from "../pages/HomePage";
import Agendarcita from "../pages/AgendarCitaPaciente";
import MisCitasPage from "../pages/MisCitas";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas con navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/agendarcita" element={<Agendarcita />} />
          <Route path="/mis-citas" element={<MisCitasPage />} />
        </Route>

        {/* Páginas públicas SIN navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrar" element={<RegistrarPage />} />

        {/* Dashboard y otras rutas */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* ... */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
