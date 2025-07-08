import {
  Users, Calendar, Stethoscope, FileText,
  BarChart3, Settings, Home
} from "lucide-react";

export const sidebarItems = [
  { title: "Inicio", icon: Home, path: "/dashboard" },
  { title: "Usuarios", icon: Users, path: "/dashboard/usuarios" },
  { title: "Citas", icon: Calendar, path: "/dashboard/citas" },
  // { title: "Tratamientos", icon: Stethoscope, path: "/dashboard/tratamientos" },
  // { title: "Expedientes", icon: FileText, path: "/dashboard/expedientes" },
  // { title: "Reportes", icon: BarChart3, path: "/dashboard/reportes" },
];
