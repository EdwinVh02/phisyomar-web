import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight, Star, Play, Menu, X, Globe, Users, Zap, Shield, Stethoscope } from 'lucide-react';
import { Link } from "react-router-dom";

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Rápido y fácil",
      description: "Registra, agenda y gestiona pacientes en segundos"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Privado y seguro",
      description: "Tus datos y los de tus pacientes protegidos siempre"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Para tu clínica",
      description: "Ideal para profesionales independientes o grupos"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Accesible",
      description: "Usa Phisyomar donde y cuando quieras"
    }
  ];

  const testimonials = [
    {
      name: "Dra. Fernanda Rivera",
      role: "Fisioterapeuta",
      content: "Phisyomar simplificó totalmente mi agenda y el seguimiento de mis pacientes.",
      rating: 5
    },
    {
      name: "Lic. Manuel Tovar",
      role: "Terapeuta físico",
      content: "Por fin un sistema fácil y seguro para mi consultorio.",
      rating: 5
    },
    {
      name: "Clínica Movilidad",
      role: "Clínica privada",
      content: "Nos ayudó a crecer y ser más organizados. Muy recomendado.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-white to-blue-400 text-blue-900 overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-300/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent"
          >
            <Stethoscope className="w-8 h-8 text-blue-500" />
            Phisyomar
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="hover:text-blue-600 transition-colors duration-300">Inicio</a>
            <a href="#caracteristicas" className="hover:text-blue-600 transition-colors duration-300">Características</a>
            <a href="#testimonios" className="hover:text-blue-600 transition-colors duration-300">Testimonios</a>
            <a href="#contacto" className="hover:text-blue-600 transition-colors duration-300">Contacto</a>
            <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow">
              Iniciar sesión
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 text-blue-900 backdrop-blur-md p-6 space-y-4 shadow-xl">
            <a href="#inicio" className="block hover:text-blue-600 transition-colors duration-300">Inicio</a>
            <a href="#caracteristicas" className="block hover:text-blue-600 transition-colors duration-300">Características</a>
            <a href="#testimonios" className="block hover:text-blue-600 transition-colors duration-300">Testimonios</a>
            <a href="#contacto" className="block hover:text-blue-600 transition-colors duration-300">Contacto</a>
            <Link to="/login" className="block w-full bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 font-semibold text-center shadow">
              Iniciar sesión
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-6xl mx-auto">
          <div 
            className="transform transition-all duration-1000 ease-out"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Tu clínica <span className="text-blue-700">en control</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-800 max-w-3xl mx-auto">
              Gestiona pacientes, agenda y expedientes <b>con un clic</b>. Sencillo, rápido y seguro. <span className="hidden md:inline">Phisyomar es el software hecho para profesionales como tú.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/registrar" className="group bg-blue-600 px-8 py-4 rounded-full text-lg font-semibold text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
                Crear cuenta gratis
                <ArrowRight className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <a href="#caracteristicas" className="group flex items-center px-8 py-4 border-2 border-blue-400 rounded-full text-lg font-semibold hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 backdrop-blur-sm">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Ver más
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">+1,500</div>
                <div className="text-blue-700">Citas gestionadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                <div className="text-blue-700">Disponibilidad</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <div className="text-blue-700">Acceso web seguro</div>
              </div>
            </div>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-blue-400" />
        </div>
      </section>

      {/* Features Section */}
      <section id="caracteristicas" className="relative z-10 px-6 py-20 bg-blue-50/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            ¿Por qué elegir Phisyomar?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-white rounded-2xl border border-blue-100 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl text-center"
              >
                <div className="text-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-blue-800">
                  {feature.title}
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            Historias reales, resultados reales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group p-8 bg-white rounded-2xl border border-blue-100 hover:border-blue-400 transition-all duration-300 transform hover:scale-105 shadow"
              >
                <div className="flex mb-4 justify-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-blue-800 mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                <div>
                  <div className="font-semibold text-blue-700">{testimonial.name}</div>
                  <div className="text-sm text-blue-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-r from-blue-400/20 to-blue-700/20 backdrop-blur-sm" id="contacto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            ¿Listo para dar el siguiente paso?
          </h2>
          <p className="text-xl text-blue-800 mb-8">
            Comienza gratis y lleva el control de tu clínica al siguiente nivel.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/registrar" className="bg-blue-600 px-8 py-4 rounded-full text-lg font-semibold text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl">
              Crear cuenta
            </Link>
            <a href="mailto:contacto@phisyomar.com" className="px-8 py-4 border-2 border-blue-400 rounded-full text-lg font-semibold hover:bg-blue-50 hover:text-blue-700 transition-all duration-300">
              Contacto
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 bg-blue-800/90 text-blue-100 border-t border-blue-300/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-blue-300 to-blue-600 bg-clip-text text-transparent">
            <Stethoscope className="w-7 h-7 text-blue-300" />
            Phisyomar
          </div>
          <div className="text-sm text-blue-100/80 text-center md:text-right">
            © {new Date().getFullYear()} Phisyomar. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
