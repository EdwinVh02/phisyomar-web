import React from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Phone, Mail, Clock, Shield, Award, Users, Calendar, Star } from "lucide-react";

const Footer = React.memo(function Footer() {
  return (
    <footer className="relative z-10 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Contenido principal del footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo y descripción */}
          <div className="space-y-4">
            <Link
              to="/"
              className="flex items-center gap-3 text-2xl font-bold text-white hover:text-blue-200 transition-colors duration-300"
            >
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              Clínica PhysioMar
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed">
              Tu centro de fisioterapia de confianza. Brindamos tratamientos especializados 
              con tecnología avanzada para tu completa rehabilitación y bienestar.
            </p>
            <div className="flex items-center gap-2 text-blue-200 text-sm">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>Centro certificado desde 2020</span>
            </div>
            <div className="flex items-center gap-2 text-blue-200 text-sm">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Normas sanitarias certificadas</span>
            </div>
          </div>

          {/* Servicios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-300" />
              Nuestros Servicios
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/registrar" className="text-blue-200 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Star className="w-3 h-3" />
                  Fisioterapia Deportiva
                </Link>
              </li>
              <li>
                <Link to="/registrar" className="text-blue-200 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Star className="w-3 h-3" />
                  Rehabilitación Neurológica
                </Link>
              </li>
              <li>
                <Link to="/registrar" className="text-blue-200 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Star className="w-3 h-3" />
                  Terapia Manual
                </Link>
              </li>
              <li>
                <Link to="/registrar" className="text-blue-200 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Star className="w-3 h-3" />
                  Electroestimulación
                </Link>
              </li>
              <li>
                <Link to="/registrar" className="text-blue-200 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Star className="w-3 h-3" />
                  Consulta Especializada
                </Link>
              </li>
              <li>
                <Link to="/registrar" className="text-blue-200 hover:text-white transition-colors text-sm flex items-center gap-2">
                  <Star className="w-3 h-3" />
                  Terapia Ocupacional
                </Link>
              </li>
            </ul>
          </div>

          {/* Acceso rápido */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-300" />
              Acceso Rápido
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-blue-200 hover:text-white transition-colors text-sm block hover:translate-x-1 transition-transform duration-200">
                  › Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/registrar" className="text-blue-200 hover:text-white transition-colors text-sm block hover:translate-x-1 transition-transform duration-200">
                  › Crear Cuenta
                </Link>
              </li>
              <li>
                <Link to="/registrar" className="text-blue-200 hover:text-white transition-colors text-sm block hover:translate-x-1 transition-transform duration-200">
                  › Agendar Cita
                </Link>
              </li>
              <li>
                <Link to="/#servicios" className="text-blue-200 hover:text-white transition-colors text-sm block hover:translate-x-1 transition-transform duration-200">
                  › Nuestros Servicios
                </Link>
              </li>
              <li>
                <Link to="/#testimonios" className="text-blue-200 hover:text-white transition-colors text-sm block hover:translate-x-1 transition-transform duration-200">
                  › Testimonios
                </Link>
              </li>
              <li>
                <Link to="/#contacto" className="text-blue-200 hover:text-white transition-colors text-sm block hover:translate-x-1 transition-transform duration-200">
                  › Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-300" />
              Información de Contacto
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
                <div className="text-blue-200 text-sm">
                  <p className="font-medium text-white">Dirección Principal:</p>
                  <p>Av. Reforma 1234, Piso 5</p> 
                  <p>Col. Centro, CP 06000</p>
                  <p>Ciudad de México, CDMX</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-300 flex-shrink-0" />
                <div className="text-blue-200 text-sm">
                  <p className="font-medium text-white">Teléfonos:</p>
                  <a href="tel:+5255551234567" className="hover:text-white transition-colors block">
                    +52 55 5555 1234 (Principal)
                  </a>
                  <a href="tel:+5255551234568" className="hover:text-white transition-colors block">
                    +52 55 5555 1235 (Emergencias)
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
                <div className="text-blue-200 text-sm">
                  <p className="font-medium text-white">Correos:</p>
                  <a href="mailto:info@physioMar.com" className="hover:text-white transition-colors block">
                    info@physioMar.com
                  </a>
                  <a href="mailto:citas@physioMar.com" className="hover:text-white transition-colors block">
                    citas@physioMar.com
                  </a>
                  <a href="mailto:emergencias@physioMar.com" className="hover:text-white transition-colors block">
                    emergencias@physioMar.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-300 mt-0.5 flex-shrink-0" />
                <div className="text-blue-200 text-sm">
                  <p className="font-medium text-white">Horarios de Atención:</p>
                  <p>Lunes a Viernes: 7:00 - 21:00</p>
                  <p>Sábados: 8:00 - 15:00</p>
                  <p>Domingos: Solo emergencias</p>
                  <p className="text-yellow-300 text-xs mt-1">* Citas previa programación</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Línea divisoria y enlaces legales */}
        <div className="border-t border-blue-700 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-blue-200 text-sm text-center lg:text-left">
              <p className="mb-2 flex items-center justify-center lg:justify-start gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                Tu bienestar es nuestra pasión
              </p>
              <p>© {new Date().getFullYear()} Clínica PhysioMar. Todos los derechos reservados.</p>
              <p className="text-xs text-blue-300 mt-1">
                Registro Sanitario: COFEPRIS-123456789 | Cédula Profesional Colectiva: 98765432
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link to="#" className="text-blue-200 hover:text-white transition-colors hover:underline">
                Política de Privacidad
              </Link>
              <Link to="#" className="text-blue-200 hover:text-white transition-colors hover:underline">
                Términos de Uso
              </Link>
              <Link to="#" className="text-blue-200 hover:text-white transition-colors hover:underline">
                Aviso Legal
              </Link>
              <Link to="#" className="text-blue-200 hover:text-white transition-colors hover:underline">
                Políticas de Calidad
              </Link>
              <Link to="#" className="text-blue-200 hover:text-white transition-colors hover:underline">
                Código de Ética
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;