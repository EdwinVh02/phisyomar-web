import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className={`${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} flex-1 transition-all duration-300 p-8`}>
          <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 p-8 min-h-[70vh]">
            <Outlet />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
