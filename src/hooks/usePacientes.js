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
      const data = await getPacientes();
      setPacientes(data);
    } catch (err) {
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