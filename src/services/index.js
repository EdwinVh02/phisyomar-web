// Exportar todos los servicios desde un solo archivo
export * from './pacienteService';
export * from './citaService';
export * from './terapeutaService';
export * from './especialidadService';
export * from './usuarioService';
export * from './historialService';

// Nuevos servicios del administrador
export * from './recepcionistaService';
export * from './clinicaService';
export * from './pagoService';
export * from './bitacoraService';
export * from './estadisticaService';
export * from './databaseService';
export * from './configuracionService';
export * from './roleManagementService';
export * from './dashboardService';

// Exportar instancia de API
export { default as api } from './api';