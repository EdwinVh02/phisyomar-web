import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Ajusta el path según tu estructura
import { useState } from "react";

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} flex-1 transition-all duration-300 p-8`}>
        <div className="max-w-7xl mx-auto bg-white/80 rounded-2xl shadow-xl p-8 min-h-[70vh]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
