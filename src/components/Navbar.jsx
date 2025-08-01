// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";

const Navbar = React.memo(function Navbar() {
  return (
    <nav className="w-full z-50 bg-white/80 backdrop-blur shadow-lg sticky top-0 flex items-center justify-between px-6 py-4">
      {/* Logo e inicio */}
      <Link
        to="/"
        className="flex items-center gap-2 group text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent select-none"
      >
        <Stethoscope className="w-9 h-9 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
        <span className="tracking-tight">Phisyomar</span>
      </Link>

      {/* Acciones de usuario */}
      <div className="flex items-center gap-4">
        <Link
          to="/login"
          className="px-5 py-2 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow hover:scale-105 hover:shadow-lg transition-all duration-150"
        >
          Iniciar sesión
        </Link>
        <span className="w-px h-6 bg-blue-200 mx-2 hidden sm:inline-block"></span>
        <Link
          to="/registrar"
          className="font-semibold text-blue-700 hover:underline hover:text-blue-900 transition"
        >
          Crear cuenta
        </Link>
      </div>
    </nav>
  );
});

export default Navbar;
