import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  User, 
  Stethoscope, 
  Activity, 
  Heart, 
  AlertTriangle,
  Target,
  Calendar,
  Save,
  X,
  Plus,
  ClipboardList,
  Brain,
  Zap
} from 'lucide-react';
import '../styles/historial-form.css';

export default function HistorialMedicoForm({ 
  paciente, 
  historialExistente = null, 
  onSave, 
  onCancel, 
  esEdicion = false,
  esVisualizacion = false 
}) {
  const [formData, setFormData] = useState({
    // Información general
    fecha_creacion: historialExistente?.fecha_creacion || new Date().toISOString().split('T')[0],
    observacion_general: historialExistente?.observacion_general || '',
    motivo_consulta: historialExistente?.motivo_consulta || '',
    
    // Historia clínica
    alergias: historialExistente?.alergias || '',
    medicamentos_actuales: historialExistente?.medicamentos_actuales || '',
    antecedentes_familiares: historialExistente?.antecedentes_familiares || '',
    cirugias_previas: historialExistente?.cirugias_previas || '',
    lesiones_previas: historialExistente?.lesiones_previas || '',
    
    // Evaluación física
    inspeccion_general: historialExistente?.inspeccion_general || '',
    rango_movimiento: historialExistente?.rango_movimiento || '',
    fuerza_muscular: historialExistente?.fuerza_muscular || '',
    pruebas_especiales: historialExistente?.pruebas_especiales || '',
    dolor_eva: historialExistente?.dolor_eva || 0,
    
    // Diagnóstico y plan
    diagnostico_fisioterapeutico: historialExistente?.diagnostico_fisioterapeutico || '',
    frecuencia_sesiones: historialExistente?.frecuencia_sesiones || '',
    tecnicas_propuestas: historialExistente?.tecnicas_propuestas || '',
    
    // Objetivos
    objetivos_corto_plazo: historialExistente?.objetivos_corto_plazo || '',
    objetivos_mediano_plazo: historialExistente?.objetivos_mediano_plazo || '',
    objetivos_largo_plazo: historialExistente?.objetivos_largo_plazo || '',
    
    // Seguimiento
    evolucion_notas_seguimiento: historialExistente?.evolucion_notas_seguimiento || '',
    
    // Firmas
    firma_fisioterapeuta: historialExistente?.firma_fisioterapeuta || '',
    firma_paciente: historialExistente?.firma_paciente || ''
  });

  const [activeTab, setActiveTab] = useState('general');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = [
    { id: 'general', label: 'Información General', icon: FileText },
    { id: 'historia', label: 'Historia Clínica', icon: Heart },
    { id: 'evaluacion', label: 'Evaluación Física', icon: Activity },
    { id: 'diagnostico', label: 'Diagnóstico y Plan', icon: Stethoscope },
    { id: 'objetivos', label: 'Objetivos', icon: Target },
    { id: 'seguimiento', label: 'Seguimiento', icon: ClipboardList }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones básicas
    if (!formData.motivo_consulta.trim()) {
      newErrors.motivo_consulta = 'El motivo de consulta es requerido';
    }
    
    if (!formData.diagnostico_fisioterapeutico.trim()) {
      newErrors.diagnostico_fisioterapeutico = 'El diagnóstico fisioterapéutico es requerido';
    }
    
    if (formData.dolor_eva < 0 || formData.dolor_eva > 10) {
      newErrors.dolor_eva = 'La escala de dolor debe estar entre 0 y 10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        paciente_id: paciente.id
      };
      
      await onSave(dataToSubmit);
    } catch (error) {
      console.error('Error al guardar historial:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Creación
          </label>
          <input
            type="date"
            value={formData.fecha_creacion}
            onChange={(e) => handleInputChange('fecha_creacion', e.target.value)}
            disabled={esVisualizacion}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paciente
          </label>
          <input
            type="text"
            value={`${paciente?.nombre || ''} ${paciente?.apellido_paterno || ''}`}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 required-field">
          Motivo de Consulta
        </label>
        <textarea
          value={formData.motivo_consulta}
          onChange={(e) => handleInputChange('motivo_consulta', e.target.value)}
          disabled={esVisualizacion}
          rows={3}
          className={`form-textarea w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
            errors.motivo_consulta ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe el motivo principal de la consulta..."
        />
        {errors.motivo_consulta && (
          <p className="mt-1 text-sm text-red-600">{errors.motivo_consulta}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Observación General
        </label>
        <textarea
          value={formData.observacion_general}
          onChange={(e) => handleInputChange('observacion_general', e.target.value)}
          disabled={esVisualizacion}
          rows={4}
          className="form-textarea w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Observaciones generales del paciente..."
        />
      </div>
    </div>
  );

  const renderHistoriaTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 label-with-icon">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          Alergias
        </label>
        <textarea
          value={formData.alergias}
          onChange={(e) => handleInputChange('alergias', e.target.value)}
          disabled={esVisualizacion}
          rows={2}
          className="form-textarea w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Alergias conocidas del paciente..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Medicamentos Actuales
        </label>
        <textarea
          value={formData.medicamentos_actuales}
          onChange={(e) => handleInputChange('medicamentos_actuales', e.target.value)}
          disabled={esVisualizacion}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Medicamentos que toma actualmente..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Antecedentes Familiares
        </label>
        <textarea
          value={formData.antecedentes_familiares}
          onChange={(e) => handleInputChange('antecedentes_familiares', e.target.value)}
          disabled={esVisualizacion}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Antecedentes médicos familiares relevantes..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cirugías Previas
        </label>
        <textarea
          value={formData.cirugias_previas}
          onChange={(e) => handleInputChange('cirugias_previas', e.target.value)}
          disabled={esVisualizacion}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Cirugías anteriores y fechas..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lesiones Previas
        </label>
        <textarea
          value={formData.lesiones_previas}
          onChange={(e) => handleInputChange('lesiones_previas', e.target.value)}
          disabled={esVisualizacion}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Lesiones previas relevantes..."
        />
      </div>
    </div>
  );

  const renderEvaluacionTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Inspección General
        </label>
        <textarea
          value={formData.inspeccion_general}
          onChange={(e) => handleInputChange('inspeccion_general', e.target.value)}
          disabled={esVisualizacion}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Observaciones de la inspección física..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rango de Movimiento
        </label>
        <textarea
          value={formData.rango_movimiento}
          onChange={(e) => handleInputChange('rango_movimiento', e.target.value)}
          disabled={esVisualizacion}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Evaluación del rango de movimiento articular..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Fuerza Muscular
        </label>
        <textarea
          value={formData.fuerza_muscular}
          onChange={(e) => handleInputChange('fuerza_muscular', e.target.value)}
          disabled={esVisualizacion}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Evaluación de la fuerza muscular (escala 1-5)..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pruebas Especiales
        </label>
        <textarea
          value={formData.pruebas_especiales}
          onChange={(e) => handleInputChange('pruebas_especiales', e.target.value)}
          disabled={esVisualizacion}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Resultados de pruebas específicas realizadas..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Escala de Dolor (EVA) *
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="0"
            max="10"
            value={formData.dolor_eva}
            onChange={(e) => handleInputChange('dolor_eva', parseInt(e.target.value))}
            disabled={esVisualizacion}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex items-center justify-center w-16 h-12 dolor-indicator text-lg">
            {formData.dolor_eva}
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Sin dolor</span>
          <span>Dolor severo</span>
        </div>
        {errors.dolor_eva && (
          <p className="mt-1 text-sm text-red-600">{errors.dolor_eva}</p>
        )}
      </div>
    </div>
  );

  const renderDiagnosticoTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 required-field">
          Diagnóstico Fisioterapéutico
        </label>
        <textarea
          value={formData.diagnostico_fisioterapeutico}
          onChange={(e) => handleInputChange('diagnostico_fisioterapeutico', e.target.value)}
          disabled={esVisualizacion}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
            errors.diagnostico_fisioterapeutico ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Diagnóstico fisioterapéutico basado en la evaluación..."
        />
        {errors.diagnostico_fisioterapeutico && (
          <p className="mt-1 text-sm text-red-600">{errors.diagnostico_fisioterapeutico}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frecuencia de Sesiones
        </label>
        <input
          type="text"
          value={formData.frecuencia_sesiones}
          onChange={(e) => handleInputChange('frecuencia_sesiones', e.target.value)}
          disabled={esVisualizacion}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Ej: 3 veces por semana durante 4 semanas"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 label-with-icon">
          <Zap className="w-4 h-4 text-yellow-500" />
          Técnicas Propuestas
        </label>
        <textarea
          value={formData.tecnicas_propuestas}
          onChange={(e) => handleInputChange('tecnicas_propuestas', e.target.value)}
          disabled={esVisualizacion}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Técnicas y modalidades de tratamiento a utilizar..."
        />
      </div>
    </div>
  );

  const renderObjetivosTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 label-with-icon">
          <Target className="w-4 h-4 text-green-500" />
          Objetivos a Corto Plazo (1-2 semanas)
        </label>
        <textarea
          value={formData.objetivos_corto_plazo}
          onChange={(e) => handleInputChange('objetivos_corto_plazo', e.target.value)}
          disabled={esVisualizacion}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Objetivos específicos y medibles para las próximas 1-2 semanas..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 label-with-icon">
          <Target className="w-4 h-4 text-blue-500" />
          Objetivos a Mediano Plazo (1-2 meses)
        </label>
        <textarea
          value={formData.objetivos_mediano_plazo}
          onChange={(e) => handleInputChange('objetivos_mediano_plazo', e.target.value)}
          disabled={esVisualizacion}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Objetivos para el próximo mes o dos..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 label-with-icon">
          <Target className="w-4 h-4 text-purple-500" />
          Objetivos a Largo Plazo (3+ meses)
        </label>
        <textarea
          value={formData.objetivos_largo_plazo}
          onChange={(e) => handleInputChange('objetivos_largo_plazo', e.target.value)}
          disabled={esVisualizacion}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Objetivos funcionales y de recuperación completa..."
        />
      </div>
    </div>
  );

  const renderSeguimientoTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 label-with-icon">
          <ClipboardList className="w-4 h-4 text-indigo-500" />
          Evolución y Notas de Seguimiento
        </label>
        <textarea
          value={formData.evolucion_notas_seguimiento}
          onChange={(e) => handleInputChange('evolucion_notas_seguimiento', e.target.value)}
          disabled={esVisualizacion}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Notas de evolución del paciente a lo largo del tratamiento..."
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Firma del Fisioterapeuta
          </label>
          <input
            type="text"
            value={formData.firma_fisioterapeuta}
            onChange={(e) => handleInputChange('firma_fisioterapeuta', e.target.value)}
            disabled={esVisualizacion}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Nombre y cédula del fisioterapeuta"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Firma del Paciente
          </label>
          <input
            type="text"
            value={formData.firma_paciente}
            onChange={(e) => handleInputChange('firma_paciente', e.target.value)}
            disabled={esVisualizacion}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Firma de consentimiento del paciente"
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralTab();
      case 'historia': return renderHistoriaTab();
      case 'evaluacion': return renderEvaluacionTab();
      case 'diagnostico': return renderDiagnosticoTab();
      case 'objetivos': return renderObjetivosTab();
      case 'seguimiento': return renderSeguimientoTab();
      default: return renderGeneralTab();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-6xl mx-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {esVisualizacion ? 'Historial Médico' : esEdicion ? 'Editar Historial Médico' : 'Nuevo Historial Médico'}
            </h2>
            <p className="text-gray-600 mt-1">
              Paciente: {paciente?.nombre || ''} {paciente?.apellido_paterno || ''}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap tab-transition ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-6">
          {renderTabContent()}
        </div>

        {/* Footer */}
        {!esVisualizacion && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${isSubmitting ? 'saving-animation' : ''}`}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {esEdicion ? 'Actualizar Historial' : 'Guardar Historial'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}