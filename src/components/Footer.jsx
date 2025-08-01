import React from "react";
import { Link } from "react-router-dom";
import { Stethoscope, MapPin, Phone, Mail, Clock, Heart } from "lucide-react";

const Footer = React.memo(function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Contenido principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo y descripción */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center gap-2 group text-2xl font-extrabold text-white select-none"
            >
              <Stethoscope className="w-8 h-8 text-blue-300 group-hover:rotate-12 transition-transform duration-300" />
              <span className="tracking-tight">Phisyomar</span>
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed">
              Tu centro de fisioterapia de confianza. Brindamos tratamientos especializados 
              con tecnología avanzada para tu completa rehabilitación.
            </p>
            <div className="flex items-center gap-1 text-blue-200 text-sm">
              <Heart className="w-4 h-4 text-red-400" />
              <span>Cuidando tu bienestar desde 2020</span>
            </div>
          </div>

          {/* Servicios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Servicios</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Fisioterapia Deportiva
                </Link>
              </li>
              <li>
                <Link to="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Rehabilitación Neurológica
                </Link>
              </li>
              <li>
                <Link to="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Terapia Manual
                </Link>
              </li>
              <li>
                <Link to="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Electroestimulación
                </Link>
              </li>
              <li>
                <Link to="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Consulta Especializada
                </Link>
              </li>
            </ul>
          </div>

          {/* Acceso rápido */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Acceso Rápido</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/registrar" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Crear Cuenta
                </Link>
              </li>
              <li>
                <Link to="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Agendar Cita
                </Link>
              </li>
              <li>
                <Link to="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="#" className="text-blue-200 hover:text-white transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
                <div className="text-blue-200 text-sm">
                  <p>Av. Revolución 1234,</p>
                  <p>Col. Centro, CP 12345</p>
                  <p>Ciudad de México</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-300 flex-shrink-0" />
                <a href="tel:+5215555555555" className="text-blue-200 hover:text-white transition-colors text-sm">
                  +52 1 555 555 5555
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-300 flex-shrink-0" />
                <a href="mailto:info@phisyomar.com" className="text-blue-200 hover:text-white transition-colors text-sm">
                  info@phisyomar.com
                </a>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
                <div className="text-blue-200 text-sm">
                  <p>Lun - Vie: 8:00 - 20:00</p>
                  <p>Sáb: 8:00 - 14:00</p>
                  <p>Dom: Cerrado</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-blue-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-blue-200 text-sm">
              © 2024 Phisyomar. Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="#" className="text-blue-200 hover:text-white transition-colors">
                Política de Privacidad
              </Link>
              <Link to="#" className="text-blue-200 hover:text-white transition-colors">
                Términos de Uso
              </Link>
              <Link to="#" className="text-blue-200 hover:text-white transition-colors">
                Aviso Legal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;