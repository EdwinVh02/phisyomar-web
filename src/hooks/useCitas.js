import { useState, useEffect, useCallback } from 'react';
import { getMisCitas, agendarCita, cancelarCita } from '../services/citaService';

export function useCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCitas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Iniciando carga de citas...');
      const data = await getMisCitas();
      setCitas(Array.isArray(data) ? data : []);
      console.log('✅ Citas cargadas exitosamente:', data);
    } catch (err) {
      console.error('❌ Error en useCitas:', err);
      
      // Si el error es de conexión o timeout, mostrar datos vacíos en lugar de error
      if (err.message.includes('Tiempo de espera') || err.message.includes('Network Error')) {
        console.log('🔄 Error de conexión, mostrando lista vacía');
        setCitas([]);
        setError('No se pudieron cargar las citas. Verifica tu conexión.');
      } else {
        setError(err.message || 'Error desconocido al cargar citas');
      }
    } finally {
      setLoading(false);
    }
  }, []);

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
  }, []);

  return {
    citas,
    loading,
    error,
    fetchCitas,
    crearCita,
    cancelar
  };
}