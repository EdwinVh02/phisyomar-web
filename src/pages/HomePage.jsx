import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowRight, Star, Play, Menu, X, Heart, Phone, Calendar, CheckCircle, Stethoscope, Award, Clock, MapPin, Activity, Users, Mail, Shield } from 'lucide-react';
import { Link } from "react-router-dom";
import { getTerapeutasPublico } from '../services/terapeutaService';
import { getEspecialidades } from '../services/especialidadService';
import { getPaquetesPublico, getTarifasPublico } from '../services/paqueteService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [terapeutas, setTerapeutas] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [tarifas, setTarifas] = useState([]);
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
        const [terapeutasData, especialidadesData, paquetesData, tarifasData] = await Promise.all([
          getTerapeutasPublico().catch(() => ({ data: [] })),
          getEspecialidades().catch(() => ({ data: [] })),
          getPaquetesPublico().catch(() => []),
          getTarifasPublico().catch(() => [])
        ]);
        
        setTerapeutas(terapeutasData.data || terapeutasData || []);
        setEspecialidades(especialidadesData.data || especialidadesData || []);
        setPaquetes(paquetesData || []);
        setTarifas(tarifasData || []);
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
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden relative">
      {/* Clean geometric background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl"></div>
        <div className="absolute top-40 -left-32 w-80 h-80 bg-blue-50/80 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-60 h-60 bg-blue-200/30 rounded-full blur-3xl"></div>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-white to-blue-50/30 pointer-events-none z-0"></div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section id="inicio" className="relative z-10 px-6 py-32 text-center bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="max-w-6xl mx-auto">
          <div 
            className="transform transition-all duration-1000 ease-out"
            style={{ transform: `translateY(${scrollY * 0.05}px)` }}
          >
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium mb-8 animate-fade-in">
              <Heart className="w-4 h-4 text-blue-200" />
              Tu salud y bienestar son nuestra prioridad
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="text-white">
                Recupera tu
              </span>
              <br />
              <span className="text-blue-200">
                bienestar
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
              En <span className="text-white font-semibold">Clínica PhysioMar</span> te ayudamos a recuperar tu movilidad y calidad de vida. 
              <br className="hidden md:block" />
              Tratamientos personalizados con la mejor atención profesional.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/registrar" className="bg-white text-blue-700 px-10 py-4 rounded-lg text-lg font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Calendar className="inline mr-2 w-5 h-5" />
                Agendar Cita
              </Link>
              <a href="#precios" className="flex items-center px-10 py-4 border-2 border-white/50 rounded-lg text-lg font-semibold text-white hover:border-white hover:bg-white/10 transition-all duration-300">
                <Shield className="w-5 h-5 mr-2" />
                Ver Precios
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-3">
                  {loading ? '...' : `${terapeutas.length > 0 ? terapeutas.length : '5'}+`}
                </div>
                <div className="text-blue-100 font-medium">Fisioterapeutas Especialistas</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-3">
                  {loading ? '...' : `${especialidades.length > 0 ? especialidades.length : '8'}+`}
                </div>
                <div className="text-blue-100 font-medium">Tratamientos Especializados</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-4xl font-bold text-white mb-3">95%</div>
                <div className="text-blue-100 font-medium">Pacientes Satisfechos</div>
              </div>
            </div>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <ChevronDown className="w-6 h-6 text-white" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="servicios" className="relative z-10 px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              ¿Por qué elegir 
              <span className="text-blue-600">PhysioMar</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Somos especialistas en fisioterapia con años de experiencia ayudando a nuestros pacientes a recuperar su calidad de vida.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 bg-blue-50 rounded-2xl border border-blue-100 hover:border-blue-300 hover:bg-blue-100 transition-all duration-300 text-center"
              >
                {/* Icon */}
                <div className="text-blue-600 mb-6 mx-auto">
                  <div className="p-4 bg-blue-100 group-hover:bg-blue-200 rounded-xl transition-all duration-300">
                    {feature.icon}
                  </div>
                </div>
                
                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Precios y Paquetes Section */}
      {!loading && (paquetes.length > 0 || tarifas.length > 0) && (
        <section id="precios" className="relative z-10 px-6 py-24 bg-blue-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Precios y <span className="text-blue-600">Paquetes</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ofrecemos precios transparentes y paquetes diseñados para cada tipo de tratamiento y presupuesto
              </p>
            </div>
            
            {/* Tarifas Individuales */}
            {tarifas.length > 0 && (
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Consultas Individuales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tarifas.slice(0, 4).map((tarifa, index) => (
                    <div 
                      key={tarifa.id}
                      className="bg-white rounded-xl p-6 border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{tarifa.titulo}</h4>
                        <div className="text-3xl font-bold text-blue-600 mb-4">
                          ${parseFloat(tarifa.precio).toLocaleString('es-MX')}
                        </div>
                        <div className="text-sm text-gray-500 mb-4 capitalize">
                          Tarifa {tarifa.tipo.toLowerCase()}
                        </div>
                        {tarifa.condiciones && (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {tarifa.condiciones}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Paquetes de Tratamiento */}
            {paquetes.length > 0 && (
              <div>
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Paquetes de Tratamiento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paquetes.slice(0, 6).map((paquete, index) => (
                    <div 
                      key={paquete.id}
                      className="bg-white rounded-2xl p-8 border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl relative overflow-hidden"
                    >
                      {/* Popular badge for middle-priced packages */}
                      {index === 1 && (
                        <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                          Popular
                        </div>
                      )}
                      
                      <div className="text-center">
                        <h4 className="text-xl font-bold text-gray-900 mb-3">{paquete.nombre}</h4>
                        
                        <div className="mb-6">
                          <div className="text-4xl font-bold text-blue-600 mb-2">
                            ${parseFloat(paquete.precio).toLocaleString('es-MX')}
                          </div>
                          <div className="text-gray-500">
                            {paquete.numero_sesiones} sesiones
                          </div>
                          <div className="text-sm text-green-600 font-medium">
                            ${(parseFloat(paquete.precio) / paquete.numero_sesiones).toFixed(2)} por sesión
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-600">
                            <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                            <span className="text-sm">{paquete.tipo_terapia}</span>
                          </div>
                          {paquete.especifico_enfermedad && (
                            <div className="flex items-start text-gray-600">
                              <Heart className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{paquete.especifico_enfermedad}</span>
                            </div>
                          )}
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                            <span className="text-sm">Horarios flexibles</span>
                          </div>
                        </div>
                        
                        <Link 
                          to="/registrar" 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 inline-block text-center"
                        >
                          Seleccionar Paquete
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                
                {paquetes.length > 6 && (
                  <div className="text-center mt-12">
                    <Link 
                      to="/registrar" 
                      className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 font-semibold"
                    >
                      Ver todos los paquetes
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Especialidades Section */}
      {!loading && especialidades.length > 0 && (
        <section className="relative z-10 px-6 py-24 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Tratamientos <span className="text-blue-600">Especializados</span>
              </h2>
              <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
                Ofrecemos una amplia gama de tratamientos de fisioterapia adaptados a tus necesidades específicas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {especialidades.slice(0, 6).map((especialidad, index) => (
                <div 
                  key={especialidad.id}
                  className="group p-8 bg-blue-50 rounded-2xl border border-blue-100 hover:border-blue-300 hover:bg-blue-100 transition-all duration-300"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-14 h-14 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center transition-all duration-300">
                      <Award className="w-7 h-7 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {especialidad.nombre}
                      </h3>
                      {especialidad.descripcion && (
                        <p className="text-gray-600 text-sm leading-relaxed">
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
        <section className="relative z-10 px-6 py-24 bg-blue-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Nuestros <span className="text-blue-600">Fisioterapeutas</span>
              </h2>
              <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
                Profesionales altamente capacitados y comprometidos con tu recuperación y bienestar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {terapeutas.slice(0, 6).map((terapeuta, index) => (
                <div 
                  key={terapeuta.id}
                  className="bg-white rounded-2xl border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                        {terapeuta.usuario?.nombre?.charAt(0)}{terapeuta.usuario?.apellido_paterno?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {terapeuta.usuario?.nombre} {terapeuta.usuario?.apellido_paterno}
                        </h3>
                        <p className="text-gray-600 text-sm font-medium">Especialista en Fisioterapia</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {terapeuta.numero_cedula && (
                        <div className="flex items-center text-gray-600">
                          <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <Shield className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="text-sm">Cédula: {terapeuta.numero_cedula}</span>
                        </div>
                      )}
                      
                      {terapeuta.telefono_consultorio && (
                        <div className="flex items-center text-gray-600">
                          <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <Phone className="w-3 h-3 text-green-600" />
                          </div>
                          <span className="text-sm">Tel: {terapeuta.telefono_consultorio}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-600">
                        <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <Activity className="w-3 h-3 text-blue-600" />
                        </div>
                        <span className="text-sm">Fisioterapia Especializada</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-blue-100 bg-blue-50">
                    <Link 
                      to="/registrar" 
                      className="flex items-center justify-center w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-all duration-300 text-sm font-semibold"
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
      {/* <section id="testimonios" className="relative z-10 px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Historias de <span className="text-blue-600">recuperación</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conoce las experiencias de nuestros pacientes y cómo hemos transformado sus vidas a través de la fisioterapia
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="p-8 bg-blue-50 rounded-2xl border border-blue-100 hover:border-blue-300 hover:bg-blue-100 transition-all duration-300"
              >
                <div>
                  {/* Stars */}
                  {/* <div className="flex mb-6 justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div> */}
                  
                  {/* Quote */}
                  {/* <div className="relative mb-8">
                    <div className="text-6xl text-blue-200/50 font-serif absolute -top-4 -left-2">"</div>
                    <p className="text-gray-700 text-lg leading-relaxed italic relative z-10">
                      {testimonial.content}
                    </p>
                    <div className="text-6xl text-blue-200/50 font-serif absolute -bottom-6 -right-2">"</div>
                  </div>
                  
                  {/* Author */}
                  {/* <div className="pt-6 border-t border-blue-200">
                    <div className="font-bold text-gray-900 text-lg mb-1">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </div> */}
            {/* ))} */}
          {/* </div> */}
        {/* </div> */} */}
      {/* </section> */} */}

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24 bg-gradient-to-r from-blue-600 to-blue-700 text-white" id="contacto">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Inicia tu <span className="text-blue-200">recuperación</span> hoy
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              No dejes que el dolor limite tu vida. Agenda tu cita y comienza tu camino hacia una mejor calidad de vida con nuestros especialistas.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/registrar" 
              className="bg-white text-blue-700 px-12 py-4 rounded-lg text-xl font-bold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Calendar className="inline mr-2 w-6 h-6" />
              Agendar Cita
            </Link>
            <a 
              href="tel:+52-555-123-4567" 
              className="flex items-center px-12 py-4 border-2 border-white/50 rounded-lg text-xl font-semibold hover:border-white hover:bg-white/10 transition-all duration-300"
            >
              <Phone className="w-6 h-6 mr-2" />
              Llamar Ahora
            </a>
          </div>
          
          {/* Additional features highlight */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-200 mb-2">✓</div>
              <div className="text-blue-100 text-sm">Primera consulta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300 mb-2">✓</div>
              <div className="text-blue-100 text-sm">Horarios flexibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-300 mb-2">✓</div>
              <div className="text-blue-100 text-sm">Planes de pago</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-300 mb-2">✓</div>
              <div className="text-blue-100 text-sm">Seguimiento integral</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
