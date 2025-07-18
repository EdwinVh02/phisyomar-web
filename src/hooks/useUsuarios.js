import { useState, useEffect } from 'react';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../services/usuarioService';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const crear = async (usuarioData) => {
    setLoading(true);
    setError(null);
    try {
      const nuevoUsuario = await createUsuario(usuarioData);
      setUsuarios(prev => [...prev, nuevoUsuario]);
      return nuevoUsuario;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizar = async (id, usuarioData) => {
    setLoading(true);
    setError(null);
    try {
      const usuarioActualizado = await updateUsuario(id, usuarioData);
      setUsuarios(prev => prev.map(u => 
        u.id === id ? usuarioActualizado : u
      ));
      return usuarioActualizado;
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
      await deleteUsuario(id);
      setUsuarios(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return {
    usuarios,
    loading,
    error,
    fetchUsuarios,
    crear,
    actualizar,
    eliminar
  };
}