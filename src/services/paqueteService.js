import api from './api';

export const getPaquetesPublico = async () => {
  try {
    const response = await api.get('/paquetes-publico');
    return response.data;
  } catch (error) {
    console.error('Error fetching paquetes:', error);
    throw error;
  }
};

export const getTarifasPublico = async () => {
  try {
    const response = await api.get('/tarifas-publico');
    return response.data;
  } catch (error) {
    console.error('Error fetching tarifas:', error);
    throw error;
  }
};