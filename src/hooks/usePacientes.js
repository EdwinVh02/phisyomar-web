import { useState, useEffect } from 'react';
import { getPacientes, createPaciente, updatePaciente, deletePaciente } from '../services/pacienteService';

export function usePacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPacientes = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Cargando pacientes desde la API...');
      const data = await getPacientes();
      console.log('✅ Datos de pacientes recibidos:', data);
      
      // Verificar que data sea un array
      if (!Array.isArray(data)) {
        console.warn('⚠️ La respuesta no es un array:', data);
        throw new Error('La respuesta del servidor no es válida para pacientes');
      }
      
      setPacientes(data);
      console.log('✅ Pacientes establecidos en el estado:', data.length, 'pacientes');
      
    } catch (err) {
      console.error('❌ Error al cargar pacientes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const crear = async (pacienteData) => {
    setLoading(true);
    setError(null);
    try {
      const nuevoPaciente = await createPaciente(pacienteData);
      setPacientes(prev => [...prev, nuevoPaciente]);
      return nuevoPaciente;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizar = async (id, pacienteData) => {
    setLoading(true);
    setError(null);
    try {
      const pacienteActualizado = await updatePaciente(id, pacienteData);
      setPacientes(prev => prev.map(p => 
        p.id === id ? pacienteActualizado : p
      ));
      return pacienteActualizado;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deletePaciente(id);
      setPacientes(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  return {
    pacientes,
    loading,
    error,
    fetchPacientes,
    crear,
    actualizar,
    eliminar
  };
}