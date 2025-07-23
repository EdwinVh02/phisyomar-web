import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight, Star, Play, Menu, X, Heart, Phone, Calendar, CheckCircle, Stethoscope, Award, Clock, MapPin, Activity, Users } from 'lucide-react';
import { Link } from "react-router-dom";
import { getTerapeutasPublico } from '../services/terapeutaService';
import { getEspecialidades } from '../services/especialidadService';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [terapeutas, setTerapeutas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        const [terapeutasData, especialidadesData] = await Promise.all([
          getTerapeutasPublico().catch(() => ({ data: [] })),
          getEspecialidades().catch(() => ({ data: [] }))
        ]);
        
        setTerapeutas(terapeutasData.data || terapeutasData || []);
        setEspecialidades(especialidadesData.data || especialidadesData || []);
      } catch (error) {
        console.error('Error loading public data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, []);

  const features = [
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Rehabilitación Integral",
      description: "Tratamientos personalizados para tu recuperación completa"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Atención Personalizada",
      description: "Cada paciente recibe un plan de tratamiento único"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Resultados Comprobados",
      description: "Técnicas avaladas científicamente para tu bienestar"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Horarios Flexibles",
      description: "Agenda tu cita en el horario que mejor te convenga"
    }
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Paciente",
      content: "Después de mi lesión de rodilla, el equipo de PhysioMar me ayudó a recuperarme completamente. ¡Excelente atención!",
      rating: 5
    },
    {
      name: "Carlos Ramírez",
      role: "Deportista",
      content: "Gracias a los tratamientos especializados pude volver a correr. El personal es muy profesional y amable.",
      rating: 5
    },
    {
      name: "Ana Martínez",
      role: "Paciente",
      content: "Mi dolor de espalda desapareció con el tratamiento. Recomiendo PhysioMar al 100%.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white overflow-hidden relative">
      {/* Modern animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-32 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 right-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/5 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>
      
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10 pointer-events-none z-0"></div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent hover:from-blue-300 hover:to-cyan-200 transition-all duration-300"
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            Clínica PhysioMar
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium relative group">
              Inicio
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#servicios" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium relative group">
              Servicios
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#testimonios" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium relative group">
              Testimonios
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#contacto" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium relative group">
              Contacto
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <Link to="/login" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg hover:shadow-xl">
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-800/95 backdrop-blur-xl p-6 space-y-4 shadow-2xl rounded-b-2xl border border-slate-700/50">
            <a href="#inicio" className="block text-gray-300 hover:text-white transition-colors duration-300 py-2">Inicio</a>
            <a href="#servicios" className="block text-gray-300 hover:text-white transition-colors duration-300 py-2">Servicios</a>
            <a href="#testimonios" className="block text-gray-300 hover:text-white transition-colors duration-300 py-2">Testimonios</a>
            <a href="#contacto" className="block text-gray-300 hover:text-white transition-colors duration-300 py-2">Contacto</a>
            <Link to="/login" className="block w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-semibold text-center shadow-lg mt-4">
              Iniciar sesión
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative z-10 px-6 py-32 text-center">
        <div className="max-w-6xl mx-auto">
          <div 
            className="transform transition-all duration-1000 ease-out"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          >
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full text-blue-200 text-sm font-medium mb-8 animate-fade-in">
              <Heart className="w-4 h-4" />
              Tu salud y bienestar son nuestra prioridad
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent animate-gradient-x">
                Recupera tu
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x" style={{animationDelay: '0.5s'}}>
                bienestar
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
              En <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-semibold">Clínica PhysioMar</span> te ayudamos a recuperar tu movilidad y calidad de vida. 
              <br className="hidden md:block" />
              Tratamientos personalizados con tecnología de vanguardia. <span className="hidden md:inline text-gray-400">Tu recuperación es nuestra misión.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/registrar" className="group relative bg-gradient-to-r from-blue-500 to-cyan-500 px-10 py-4 rounded-full text-lg font-bold text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative z-10">Agendar Cita</span>
                <Calendar className="relative z-10 inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <a href="#servicios" className="group flex items-center px-10 py-4 border-2 border-gray-400/30 rounded-full text-lg font-semibold text-gray-300 hover:border-blue-400/50 hover:text-white transition-all duration-300 backdrop-blur-sm hover:bg-blue-500/10">
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Nuestros Servicios
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="group text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-3">
                  {loading ? '...' : `${terapeutas.length}+`}
                </div>
                <div className="text-gray-300 font-medium">Fisioterapeutas Especialistas</div>
              </div>
              <div className="group text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                  {loading ? '...' : `${especialidades.length}+`}
                </div>
                <div className="text-gray-300 font-medium">Tratamientos Especializados</div>
              </div>
              <div className="group text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <div className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-3">95%</div>
                <div className="text-gray-300 font-medium">Pacientes Satisfechos</div>
              </div>
            </div>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <ChevronDown className="w-6 h-6 text-gray-300" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="servicios" className="relative z-10 px-6 py-32 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              ¿Por qué elegir 
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">PhysioMar</span>?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Somos especialistas en fisioterapia con años de experiencia ayudando a nuestros pacientes a recuperar su calidad de vida.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative p-8 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 hover:border-blue-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 text-center backdrop-blur-sm overflow-hidden"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Icon */}
                <div className="relative z-10 text-blue-400 mb-6 group-hover:text-cyan-300 group-hover:scale-110 transition-all duration-500 mx-auto">
                  <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-400/30 group-hover:border-cyan-400/50 transition-all duration-500">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-200 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Especialidades Section */}
      {!loading && especialidades.length > 0 && (
        <section className="relative z-10 px-6 py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Tratamientos <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Especializados</span>
              </h2>
              <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">
                Ofrecemos una amplia gama de tratamientos de fisioterapia adaptados a tus necesidades específicas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {especialidades.slice(0, 6).map((especialidad, index) => (
                <div 
                  key={especialidad.id}
                  className="group relative p-8 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 hover:border-blue-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm overflow-hidden"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-400/30">
                      <Award className="w-7 h-7 text-blue-400 group-hover:text-cyan-300 transition-colors duration-300" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300">
                        {especialidad.nombre}
                      </h3>
                      {especialidad.descripcion && (
                        <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                          {especialidad.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Terapeutas Section */}
      {!loading && terapeutas.length > 0 && (
        <section className="relative z-10 px-6 py-32 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Nuestros <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Fisioterapeutas</span>
              </h2>
              <p className="text-xl text-gray-400 mb-16 max-w-3xl mx-auto">
                Profesionales altamente capacitados y comprometidos con tu recuperación y bienestar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {terapeutas.slice(0, 6).map((terapeuta, index) => (
                <div 
                  key={terapeuta.id}
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 hover:border-blue-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm overflow-hidden"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10 p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {terapeuta.nombre?.charAt(0)}{terapeuta.apellido?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-300">
                          {terapeuta.nombre} {terapeuta.apellido}
                        </h3>
                        <p className="text-gray-400 text-sm font-medium">Especialista en Fisioterapia</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {terapeuta.experiencia_anos && (
                        <div className="flex items-center text-gray-300">
                          <div className="w-5 h-5 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                            <Clock className="w-3 h-3 text-blue-400" />
                          </div>
                          <span className="text-sm">{terapeuta.experiencia_anos} años de experiencia</span>
                        </div>
                      )}
                      
                      {terapeuta.telefono && (
                        <div className="flex items-center text-gray-300">
                          <div className="w-5 h-5 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                            <MapPin className="w-3 h-3 text-green-400" />
                          </div>
                          <span className="text-sm">Tel: {terapeuta.telefono}</span>
                        </div>
                      )}
                    </div>
                    
                    {terapeuta.especialidades && terapeuta.especialidades.length > 0 && (
                      <div className="mb-6">
                        <p className="text-xs text-gray-400 mb-3 font-medium">Especialidades:</p>
                        <div className="flex flex-wrap gap-2">
                          {terapeuta.especialidades.slice(0, 3).map((esp, espIndex) => (
                            <span 
                              key={espIndex}
                              className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 text-xs rounded-full border border-blue-400/30 font-medium"
                            >
                              {esp.nombre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative z-10 p-6 border-t border-white/10 bg-gradient-to-r from-white/5 to-white/10">
                    <Link 
                      to="/registrar" 
                      className="flex items-center justify-center w-full text-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 text-sm font-semibold shadow-lg transform hover:scale-105"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Cita
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            {terapeutas.length > 6 && (
              <div className="text-center mt-16">
                <Link 
                  to="/registrar" 
                  className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 font-bold shadow-2xl hover:shadow-blue-500/25"
                >
                  Agendar con un especialista
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Loading State */}
      {loading && (
        <section className="relative z-10 px-6 py-32">
          <div className="max-w-6xl mx-auto text-center">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-400/20 border-t-blue-400 mb-6"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-400/40"></div>
            </div>
            <p className="text-gray-300 text-lg">Cargando información de nuestros profesionales...</p>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section id="testimonios" className="relative z-10 px-6 py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Historias de <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">recuperación</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Conoce las experiencias de nuestros pacientes y cómo hemos transformado sus vidas a través de la fisioterapia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="group relative p-8 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 hover:border-blue-400/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 backdrop-blur-sm overflow-hidden"
                style={{animationDelay: `${index * 0.2}s`}}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex mb-6 justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current drop-shadow-sm" />
                    ))}
                  </div>
                  
                  {/* Quote */}
                  <div className="relative mb-8">
                    <div className="text-6xl text-blue-400/20 font-serif absolute -top-4 -left-2">“</div>
                    <p className="text-gray-300 text-lg leading-relaxed italic relative z-10 group-hover:text-white transition-colors duration-300">
                      {testimonial.content}
                    </p>
                    <div className="text-6xl text-blue-400/20 font-serif absolute -bottom-6 -right-2">”</div>
                  </div>
                  
                  {/* Author */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="font-bold text-white text-lg mb-1 group-hover:text-blue-200 transition-colors duration-300">{testimonial.name}</div>
                    <div className="text-gray-400 text-sm font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-32 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm" id="contacto">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-black mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Inicia tu <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">recuperación</span> hoy
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              No dejes que el dolor limite tu vida. Agenda tu cita y comienza tu camino hacia una mejor calidad de vida con nuestros especialistas.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/registrar" 
              className="group relative bg-gradient-to-r from-blue-500 to-cyan-500 px-12 py-5 rounded-full text-xl font-bold text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <Calendar className="relative z-10 inline mr-2 w-6 h-6" />
              <span className="relative z-10">Agendar Cita</span>
            </Link>
            <a 
              href="tel:+52-555-123-4567" 
              className="flex items-center px-12 py-5 border-2 border-gray-400/30 rounded-full text-xl font-semibold text-gray-300 hover:border-blue-400/50 hover:text-white hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-sm"
            >
              <Phone className="w-6 h-6 mr-2" />
              Llamar Ahora
            </a>
          </div>
          
          {/* Additional features highlight */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">✓</div>
              <div className="text-gray-300 text-sm">Primera consulta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">✓</div>
              <div className="text-gray-300 text-sm">Horarios flexibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">✓</div>
              <div className="text-gray-300 text-sm">Planes de pago</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-2">✓</div>
              <div className="text-gray-300 text-sm">Seguimiento integral</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-16 bg-gradient-to-br from-slate-900 to-black border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-3 text-2xl font-bold">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Clínica PhysioMar</span>
            </div>
            <div className="text-gray-400 text-center md:text-right">
              <p className="mb-2">Tu bienestar es nuestra pasión</p>
              <p className="text-sm">© {new Date().getFullYear()} Clínica PhysioMar. Todos los derechos reservados.</p>
            </div>
          </div>
          
          {/* Contact info and hours */}
          <div className="border-t border-white/10 pt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-white font-semibold mb-2">Horarios</h4>
              <p className="text-gray-400 text-sm">Lun - Vie: 8:00 AM - 8:00 PM</p>
              <p className="text-gray-400 text-sm">Sáb: 9:00 AM - 2:00 PM</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Contacto</h4>
              <p className="text-gray-400 text-sm">Tel: +52 555 123 4567</p>
              <p className="text-gray-400 text-sm">contacto@physioMar.com</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">Ubicación</h4>
              <p className="text-gray-400 text-sm">Ciudad de México</p>
              <p className="text-gray-400 text-sm">Consultorios médicos</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
