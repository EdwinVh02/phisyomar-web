import React, { useState, useEffect } from "react";
import { getTerapeutas } from "../services/terapeutaService";
import CalendarioCitas from "./CalendarioCitas";

export default function CitaForm({ onClose, onSubmit }) {
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
  const [loading, setLoading] = useState(true);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  useEffect(() => {
    const cargarTerapeutas = async () => {
      try {
        const data = await getTerapeutas();
        setTerapeutas(data);
      } catch (error) {
        console.error('Error al cargar terapeutas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarTerapeutas();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prevForm => {
      // Verificar que prevForm existe y es un objeto
      if (!prevForm || typeof prevForm !== 'object') {
        console.error('Error: form state is not an object:', prevForm);
        return {
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
          antecedentes_no_patologicos: "",
          [name]: value || ""
        };
      }
      return { ...prevForm, [name]: value || "" };
    });
    
    // Mostrar calendario cuando se selecciona un terapeuta
    if (name === 'terapeuta_id' && value) {
      setMostrarCalendario(true);
    }
  }

  function handleDateTimeSelect(fechaHora) {
    setForm(prevForm => ({
      ...prevForm,
      fecha_hora: fechaHora
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    // Verificar que form existe
    if (!form || typeof form !== 'object') {
      console.error('Error: form state is invalid:', form);
      return;
    }
    
    // Combinar fecha y hora en formato datetime
    const citaData = {
      ...form,
      // Convertir valores numéricos
      duracion: parseInt(form.duracion) || 60,
      terapeuta_id: parseInt(form.terapeuta_id),
      escala_dolor_eva_inicio: form.escala_dolor_eva_inicio ? parseInt(form.escala_dolor_eva_inicio) : null
    };

    if (onSubmit) onSubmit(citaData, setForm);
  }

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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Agendar nueva cita</h3>
        
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terapeuta *
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="terapeuta_id"
              value={(form && form.terapeuta_id) || ""}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">
                {loading ? "Cargando terapeutas..." : "Seleccionar terapeuta"}
              </option>
              {terapeutas.map((terapeuta) => (
                <option key={terapeuta.id} value={terapeuta.id}>
                  {terapeuta.usuario?.nombre} {terapeuta.usuario?.apellido_paterno} - {terapeuta.especialidad_principal}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de cita *
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="tipo"
              value={(form && form.tipo) || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar tipo</option>
              {tiposCita.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duración (minutos)
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="duracion"
              value={(form && form.duracion) || 60}
              onChange={handleChange}
            >
              <option value={30}>30 minutos</option>
              <option value={45}>45 minutos</option>
              <option value={60}>60 minutos</option>
              <option value={90}>90 minutos</option>
              <option value={120}>120 minutos</option>
            </select>
          </div>
        </div>

        {/* Calendario de citas */}
        {mostrarCalendario && form.terapeuta_id && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona fecha y hora *
            </label>
            <CalendarioCitas
              terapeutaId={parseInt(form.terapeuta_id)}
              duracion={parseInt(form.duracion)}
              onDateTimeSelect={handleDateTimeSelect}
              value={form.fecha_hora}
            />
            {form.fecha_hora && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Fecha y hora seleccionada:</strong> {new Date(form.fecha_hora).toLocaleString('es-ES')}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="ubicacion"
              placeholder="Consultorio, sala, etc."
              value={(form && form.ubicacion) || ""}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipo asignado
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="equipo_asignado"
              placeholder="Equipos o materiales necesarios"
              value={(form && form.equipo_asignado) || ""}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Motivo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Motivo de la cita *
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name="motivo"
            placeholder="Descripción del motivo de la consulta"
            value={(form && form.motivo) || ""}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>

        {/* Información médica */}
        <div className="border-t pt-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">Información médica (opcional)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Escala de dolor EVA (0-10)
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                name="escala_dolor_eva_inicio"
                type="number"
                min="0"
                max="10"
                placeholder="0 = sin dolor, 10 = dolor máximo"
                value={(form && form.escala_dolor_eva_inicio) || ""}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ¿Cómo fue la lesión?
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                name="como_fue_lesion"
                placeholder="Descripción del mecanismo de lesión"
                value={(form && form.como_fue_lesion) || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Antecedentes patológicos
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="antecedentes_patologicos"
              placeholder="Enfermedades previas, cirugías, lesiones anteriores..."
              value={(form && form.antecedentes_patologicos) || ""}
              onChange={handleChange}
              rows={2}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Antecedentes no patológicos
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="antecedentes_no_patologicos"
              placeholder="Actividad física, ocupación, medicamentos, alergias..."
              value={(form && form.antecedentes_no_patologicos) || ""}
              onChange={handleChange}
              rows={2}
            />
          </div>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observaciones adicionales
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            name="observaciones"
            placeholder="Información adicional relevante"
            value={(form && form.observaciones) || ""}
            onChange={handleChange}
            rows={2}
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3 justify-end pt-4 border-t">
          {onClose && (
            <button
              type="button"
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              Cancelar
            </button>
          )}
          <button 
            type="submit" 
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            Agendar cita
          </button>
        </div>
      </form>
    </div>
  );
}
