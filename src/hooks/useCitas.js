import { useState, useEffect, useCallback } from 'react';
import { getMisCitas, agendarCita, cancelarCita } from '../services/citaService';

export function useCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCitas = useCallback(async () => {
    if (loading) return; // Evitar llamadas concurrentes
    
    setLoading(true);
    setError(null);
    try {
      const data = await getMisCitas();
      setCitas(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const crearCita = useCallback(async (citaData) => {
    setLoading(true);
    setError(null);
    try {
      const nuevaCita = await agendarCita(citaData);
      setCitas(prev => [...prev, nuevaCita]);
      return nuevaCita;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelar = useCallback(async (citaId) => {
    setLoading(true);
    setError(null);
    try {
      await cancelarCita(citaId);
      setCitas(prev => prev.map(cita => 
        cita.id === citaId 
          ? { ...cita, estado: 'cancelada' }
          : cita
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]);

  return {
    citas,
    loading,
    error,
    fetchCitas,
    crearCita,
    cancelar
  };
}