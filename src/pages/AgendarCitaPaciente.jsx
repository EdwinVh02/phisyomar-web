import { useState, useEffect } from "react";
import { CalendarCheck, User, Clock, FileText, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { agendarCita } from "../services/citaService";
import { getTerapeutasPublico } from "../services/terapeutaService";
import CalendarioCitas from "../components/CalendarioCitas";
import { useAuthStore } from "../store/authStore";

export default function AgendarCitaPaciente() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fecha_hora: "",
    tipo: "",
    duracion: 60,
    ubicacion: "",
    equipo_asignado: "",
    motivo: "",
    terapeuta_id: "",
    observaciones: "",
    escala_dolor_eva_inicio: "",
    como_fue_lesion: "",
    antecedentes_patologicos: "",
    antecedentes_no_patologicos: ""
  });
  const [terapeutas, setTerapeutas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTerapeutas, setLoadingTerapeutas] = useState(true);
  const [error, setError] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const cargarTerapeutas = async () => {
      try {
        const data = await getTerapeutasPublico();
        if (process.env.NODE_ENV === 'development') {
          console.log('Terapeutas cargados:', data);
        }
        setTerapeutas(data);
      } catch (error) {
        console.error('Error al cargar terapeutas:', error);
        setError('Error al cargar los terapeutas disponibles: ' + error.message);
      } finally {
        setLoadingTerapeutas(false);
      }
    };

    cargarTerapeutas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateTimeSelect = (fechaHora) => {
    setForm(prev => ({ ...prev, fecha_hora: fechaHora }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const citaData = {
        ...form,
        duracion: parseInt(form.duracion) || 60,
        terapeuta_id: parseInt(form.terapeuta_id),
        escala_dolor_eva_inicio: form.escala_dolor_eva_inicio ? parseInt(form.escala_dolor_eva_inicio) : null
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Estado de autenticación:', {
          isAuthenticated,
          user: user,
          token: token ? `Token: ${token.substring(0, 20)}...` : 'No token',
          userRole: user?.rol_id,
          userName: user?.nombre,
          userEmail: user?.correo_electronico
        });
        console.log('📋 Datos de la cita a enviar:', citaData);
      }

      await agendarCita(citaData);
      setEnviado(true);
      setTimeout(() => {
        navigate("/paciente/mis-citas");
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error completo al agendar cita:', error);
      console.error('❌ Error response:', error.response);
      setError(error.message || 'Error al agendar la cita');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const tiposCita = [
    "Evaluación inicial",
    "Fisioterapia",
    "Rehabilitación",
    "Terapia ocupacional",
    "Masaje terapéutico",
    "Electroterapia",
    "Hidroterapia",
    "Seguimiento"
  ];

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Cita Agendada!</h2>
          <p className="text-gray-600 mb-4">
            Tu cita ha sido registrada exitosamente. Recibirás una confirmación pronto.
          </p>
          <div className="animate-pulse">
            <div className="w-8 h-8 bg-blue-200 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-3xl shadow-xl flex w-full max-w-6xl overflow-hidden mx-auto">
        {/* Izquierda: Información */}
        <div className="w-1/3 bg-blue-100 p-8 flex flex-col items-center justify-center">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
              <CalendarCheck className="w-16 h-16 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Agendar Nueva Cita
          </h2>
          <p className="text-gray-600 text-center max-w-xs mb-6">
            Programa tu cita de fisioterapia de manera rápida y segura
          </p>
          
          {/* Pasos */}
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <div className={`flex items-center gap-3 p-3 rounded-lg ${step >= 1 ? 'bg-blue-200' : 'bg-gray-100'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Seleccionar Terapeuta</span>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg ${step >= 2 ? 'bg-blue-200' : 'bg-gray-100'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                <Clock className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Fecha y Hora</span>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg ${step >= 3 ? 'bg-blue-200' : 'bg-gray-100'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Información Médica</span>
            </div>
          </div>
        </div>

        {/* Derecha: Formulario */}
        <div className="w-2/3 p-8">
          <form onSubmit={handleSubmit}>
            {/* Paso 1: Seleccionar Terapeuta y Tipo */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Selecciona tu Terapeuta</h3>
                  <p className="text-gray-600 mb-6">Elige el profesional que mejor se adapte a tus necesidades</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Terapeuta *
                    </label>
                    {loadingTerapeutas ? (
                      <div className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50">
                        <div className="animate-pulse">Cargando terapeutas...</div>
                      </div>
                    ) : (
                      <select
                        name="terapeuta_id"
                        value={form.terapeuta_id}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                        required
                      >
                        <option value="">Seleccionar terapeuta</option>
                        {terapeutas.map((terapeuta) => (
                          <option key={terapeuta.id} value={terapeuta.id}>
                            {terapeuta.usuario?.nombre} {terapeuta.usuario?.apellido_paterno} - {terapeuta.especialidad_principal || 'Fisioterapia'}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de cita *
                    </label>
                    <select
                      name="tipo"
                      value={form.tipo}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                      required
                    >
                      <option value="">Seleccionar tipo</option>
                      {tiposCita.map((tipo) => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                  </div>

                  {/* Duración fija en 60 minutos - oculta para pacientes */}
                  <input type="hidden" name="duracion" value="60" />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!form.terapeuta_id || !form.tipo}
                    className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Siguiente
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Paso 2: Fecha y Hora */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Selecciona Fecha y Hora</h3>
                  <p className="text-gray-600 mb-6">Elige el mejor momento para tu cita</p>
                </div>

                <CalendarioCitas
                  terapeutaId={parseInt(form.terapeuta_id)}
                  duracion={parseInt(form.duracion)}
                  onDateTimeSelect={handleDateTimeSelect}
                  value={form.fecha_hora}
                />

                {form.fecha_hora && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">
                      <strong>Fecha y hora seleccionada:</strong> {new Date(form.fecha_hora).toLocaleString('es-ES', {
                        timeZone: 'America/Mexico_City',
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!form.fecha_hora}
                    className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Siguiente
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Paso 3: Información Médica */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Información Médica</h3>
                  <p className="text-gray-600 mb-6">Completa los detalles para una mejor atención</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motivo de la cita *
                    </label>
                    <textarea
                      name="motivo"
                      value={form.motivo}
                      onChange={handleChange}
                      placeholder="Describe el motivo de tu consulta..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Escala de dolor (0-10)
                      </label>
                      <input
                        type="number"
                        name="escala_dolor_eva_inicio"
                        value={form.escala_dolor_eva_inicio}
                        onChange={handleChange}
                        min="0"
                        max="10"
                        placeholder="0 = sin dolor, 10 = dolor máximo"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ¿Cómo fue la lesión?
                      </label>
                      <input
                        type="text"
                        name="como_fue_lesion"
                        value={form.como_fue_lesion}
                        onChange={handleChange}
                        placeholder="Mecanismo de lesión..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Antecedentes médicos patológicos
                    </label>
                    <textarea
                      name="antecedentes_patologicos"
                      value={form.antecedentes_patologicos}
                      onChange={handleChange}
                      placeholder="Enfermedades previas, cirugías, medicamentos..."
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Antecedentes no patológicos
                    </label>
                    <textarea
                      name="antecedentes_no_patologicos"
                      value={form.antecedentes_no_patologicos}
                      onChange={handleChange}
                      placeholder="Estilo de vida, hábitos, ejercicio, alimentación..."
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Observaciones adicionales
                    </label>
                    <textarea
                      name="observaciones"
                      value={form.observaciones}
                      onChange={handleChange}
                      placeholder="Información adicional relevante..."
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                  >
                    Anterior
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !form.motivo}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Agendando...
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4" />
                        Agendar Cita
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
