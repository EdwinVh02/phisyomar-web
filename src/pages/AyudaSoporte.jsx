import React, { useState } from 'react';
import { useToast } from '../hooks/useToast';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Users,
  Calendar,
  CreditCard,
  User,
  Search,
  ExternalLink,
  Headphones,
  MessageCircle,
  Globe
} from 'lucide-react';

const faqs = [
  {
    categoria: 'Citas',
    preguntas: [
      {
        pregunta: '¿Cómo puedo agendar una cita?',
        respuesta: 'Para agendar una cita, ve a la sección "Agendar Cita" en el menú principal. Selecciona tu terapeuta preferido, elige la fecha y hora disponible, y completa la información requerida. Recibirás una confirmación por correo electrónico.'
      },
      {
        pregunta: '¿Puedo cancelar o reprogramar mi cita?',
        respuesta: 'Sí, puedes cancelar o reprogramar tu cita hasta 24 horas antes de la fecha programada. Ve a "Mis Citas" para hacer cambios. Las cancelaciones con menos de 24 horas de anticipación pueden generar un cargo.'
      },
      {
        pregunta: '¿Qué debo traer a mi primera cita?',
        respuesta: 'Para tu primera cita, trae una identificación oficial, tu tarjeta de seguro (si aplica), historial médico relevante, lista de medicamentos actuales, y llega 15 minutos antes de tu cita programada.'
      },
      {
        pregunta: '¿Cuánto tiempo dura una sesión?',
        respuesta: 'Las sesiones de fisioterapia estándar duran 60 minutos. Las evaluaciones iniciales pueden durar hasta 90 minutos. El tiempo puede variar según tu plan de tratamiento específico.'
      }
    ]
  },
  {
    categoria: 'Pagos',
    preguntas: [
      {
        pregunta: '¿Qué métodos de pago aceptan?',
        respuesta: 'Aceptamos efectivo, tarjetas de crédito/débito (Visa, MasterCard, American Express), transferencias bancarias, y seguros médicos. También ofrecemos planes de pago para tratamientos largos.'
      },
      {
        pregunta: '¿Puedo pagar en línea?',
        respuesta: 'Sí, puedes pagar en línea a través de nuestro portal del paciente. Ve a "Pagos y Facturación" para ver tus facturas pendientes y realizar pagos seguros.'
      },
      {
        pregunta: '¿Cómo obtengo mi factura?',
        respuesta: 'Las facturas se envían automáticamente por correo electrónico después de cada sesión. También puedes descargarlas desde tu portal del paciente en la sección "Pagos y Facturación".'
      },
      {
        pregunta: '¿Trabajan con seguros médicos?',
        respuesta: 'Sí, trabajamos con la mayoría de seguros médicos principales. Contacta a nuestro equipo para verificar tu cobertura específica antes de tu primera cita.'
      }
    ]
  },
  {
    categoria: 'Tratamientos',
    preguntas: [
      {
        pregunta: '¿Qué tipos de tratamientos ofrecen?',
        respuesta: 'Ofrecemos fisioterapia ortopédica, neurológica, deportiva, rehabilitación post-quirúrgica, terapia manual, electroterapia, y programas de ejercicio terapéutico personalizados.'
      },
      {
        pregunta: '¿Cuántas sesiones necesitaré?',
        respuesta: 'El número de sesiones varía según tu condición específica. Después de la evaluación inicial, tu terapeuta creará un plan de tratamiento personalizado con una estimación de sesiones requeridas.'
      },
      {
        pregunta: '¿Puedo solicitar un terapeuta específico?',
        respuesta: 'Sí, puedes solicitar un terapeuta específico al agendar tu cita. Haremos todo lo posible para acomodar tu preferencia según disponibilidad.'
      },
      {
        pregunta: '¿Ofrecen ejercicios para hacer en casa?',
        respuesta: 'Sí, como parte de tu tratamiento, recibirás ejercicios personalizados para realizar en casa. Estos complementan tu terapia en clínica y aceleran tu recuperación.'
      }
    ]
  },
  {
    categoria: 'Cuenta',
    preguntas: [
      {
        pregunta: '¿Cómo actualizo mi información personal?',
        respuesta: 'Puedes actualizar tu información personal en la sección "Mi Perfil". Mantén actualizada tu información de contacto para recibir recordatorios importantes sobre tus citas.'
      },
      {
        pregunta: '¿Cómo cambio mi contraseña?',
        respuesta: 'Para cambiar tu contraseña, ve a "Mi Perfil" y selecciona "Cambiar Contraseña". También puedes usar la opción "Olvidé mi contraseña" en la página de inicio de sesión.'
      },
      {
        pregunta: '¿Puedo ver mi historial médico en línea?',
        respuesta: 'Sí, tu historial médico completo está disponible en la sección "Historial Médico" de tu portal del paciente. Incluye notas de sesiones, planes de tratamiento y progreso.'
      },
      {
        pregunta: '¿Cómo elimino mi cuenta?',
        respuesta: 'Para eliminar tu cuenta, contacta a nuestro equipo de soporte. Ten en cuenta que esto eliminará permanentemente tu historial médico y no podrás recuperarlo.'
      }
    ]
  }
];

const contactInfo = {
  telefono: '+52 (555) 123-4567',
  email: 'soporte@phisyomar.com',
  horarios: 'Lunes a Viernes: 8:00 AM - 8:00 PM\nSábados: 9:00 AM - 2:00 PM',
  direccion: 'Av. Reforma 123, Col. Centro\nCiudad de México, CDMX 06000',
  whatsapp: '+52 (555) 123-4567',
  tiempoRespuesta: '24 horas'
};

export default function AyudaSoporte() {
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mensajeContacto, setMensajeContacto] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
    prioridad: 'media'
  });
  const [enviandoMensaje, setEnviandoMensaje] = useState(false);
  const { showSuccess } = useToast();

  const togglePregunta = (categoria, index) => {
    const key = `${categoria}-${index}`;
    setPreguntaAbierta(preguntaAbierta === key ? null : key);
  };

  const filtrarPreguntas = () => {
    let preguntasFiltradas = faqs;
    
    if (categoriaSeleccionada) {
      preguntasFiltradas = preguntasFiltradas.filter(cat => cat.categoria === categoriaSeleccionada);
    }
    
    if (busqueda) {
      preguntasFiltradas = preguntasFiltradas.map(categoria => ({
        ...categoria,
        preguntas: categoria.preguntas.filter(p => 
          p.pregunta.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.respuesta.toLowerCase().includes(busqueda.toLowerCase())
        )
      })).filter(categoria => categoria.preguntas.length > 0);
    }
    
    return preguntasFiltradas;
  };

  const handleContactoChange = (e) => {
    const { name, value } = e.target;
    setMensajeContacto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    setEnviandoMensaje(true);
    
    // Simular envío de mensaje
    setTimeout(() => {
      showSuccess('Mensaje enviado exitosamente. Te responderemos pronto.');
      setMensajeContacto({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: '',
        prioridad: 'media'
      });
      setEnviandoMensaje(false);
    }, 2000);
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'bg-red-100 text-red-600';
      case 'media': return 'bg-yellow-100 text-yellow-600';
      case 'baja': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayuda y Soporte</h1>
        <p className="text-gray-600">Encuentra respuestas y obtén ayuda cuando la necesites</p>
      </div>

      {/* Información de Contacto Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Teléfono</h3>
            <p className="text-sm text-gray-600">{contactInfo.telefono}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
            <p className="text-sm text-gray-600">{contactInfo.whatsapp}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <p className="text-sm text-gray-600">{contactInfo.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Respuesta</h3>
            <p className="text-sm text-gray-600">{contactInfo.tiempoRespuesta}</p>
          </div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Preguntas Frecuentes</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar preguntas..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas las categorías</option>
              <option value="Citas">Citas</option>
              <option value="Pagos">Pagos</option>
              <option value="Tratamientos">Tratamientos</option>
              <option value="Cuenta">Cuenta</option>
            </select>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          {filtrarPreguntas().map((categoria) => (
            <div key={categoria.categoria}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                {categoria.categoria === 'Citas' && <Calendar className="w-5 h-5 text-blue-600" />}
                {categoria.categoria === 'Pagos' && <CreditCard className="w-5 h-5 text-green-600" />}
                {categoria.categoria === 'Tratamientos' && <Headphones className="w-5 h-5 text-purple-600" />}
                {categoria.categoria === 'Cuenta' && <User className="w-5 h-5 text-orange-600" />}
                {categoria.categoria}
              </h3>
              
              <div className="space-y-2">
                {categoria.preguntas.map((faq, index) => {
                  const isOpen = preguntaAbierta === `${categoria.categoria}-${index}`;
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => togglePregunta(categoria.categoria, index)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.pregunta}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-3 text-gray-600">
                          {faq.respuesta}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {filtrarPreguntas().length === 0 && (
          <div className="text-center py-8">
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No se encontraron preguntas
            </h3>
            <p className="text-gray-600">
              Intenta con diferentes términos de búsqueda o categorías
            </p>
          </div>
        )}
      </div>

      {/* Formulario de Contacto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Enviar Mensaje</h3>
          </div>
          <form onSubmit={handleEnviarMensaje} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={mensajeContacto.nombre}
                  onChange={handleContactoChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={mensajeContacto.email}
                  onChange={handleContactoChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  name="asunto"
                  value={mensajeContacto.asunto}
                  onChange={handleContactoChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  name="prioridad"
                  value={mensajeContacto.prioridad}
                  onChange={handleContactoChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje *
              </label>
              <textarea
                name="mensaje"
                value={mensajeContacto.mensaje}
                onChange={handleContactoChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe tu consulta o problema..."
              />
            </div>

            <button
              type="submit"
              disabled={enviandoMensaje}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {enviandoMensaje ? 'Enviando...' : 'Enviar Mensaje'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Información de Contacto</h3>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Horarios de Atención
              </h4>
              <p className="text-gray-600 whitespace-pre-line">{contactInfo.horarios}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-600" />
                Dirección
              </h4>
              <p className="text-gray-600 whitespace-pre-line">{contactInfo.direccion}</p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Canales de Soporte
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Llamadas telefónicas</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">WhatsApp</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Correo electrónico</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Portal web</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Emergencias</h4>
              </div>
              <p className="text-sm text-blue-700">
                Para emergencias médicas, contacta inmediatamente a los servicios de emergencia locales (911) o acude al hospital más cercano.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}