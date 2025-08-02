import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { useToast } from './useToast';

export const useDashboard = () => {
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    citasHoy: 0,
    ingresosMes: 0,
    eficiencia: 0
  });
  
  const [citasResumen, setCitasResumen] = useState({
    programadas: 0,
    completadas: 0,
    pendientes: 0,
    canceladas: 0
  });

  const [actividadReciente, setActividadReciente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { showToast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Intentar obtener datos del nuevo endpoint primero
      const dashboardResponse = await dashboardService.getDashboardStats().catch(async () => {
        // Fallback: usar el método legacy
        console.log('Usando método legacy para obtener datos...');
        const [statsData, activityData, citasData] = await Promise.all([
          dashboardService.getQuickCounts().catch(() => ({ 
            totalUsuarios: 0, 
            totalCitas: 0, 
            ingresosMes: 0, 
            eficiencia: 0 
          })),
          dashboardService.getRecentActivity(5).catch(() => ({ data: [] })),
          dashboardService.getTodaysCitas().catch(() => ({ data: [] }))
        ]);
        
        return {
          success: true,
          data: {
            conteos: {
              total_usuarios: statsData.totalUsuarios,
              total_citas: statsData.totalCitas,
              citas_hoy: Array.isArray(citasData.data) ? citasData.data.length : 0,
              ingresos_mes: statsData.ingresosMes,
              eficiencia: statsData.eficiencia
            },
            citas_hoy_por_estado: { programadas: 0, completadas: 0, pendientes: 0, canceladas: 0 },
            actividad_reciente: activityData.data || []
          }
        };
      });

      if (dashboardResponse.success) {
        const data = dashboardResponse.data;

        // Actualizar stats principales
        setStats({
          totalUsuarios: data.conteos.total_usuarios || 0,
          citasHoy: data.conteos.citas_hoy || 0,
          ingresosMes: data.conteos.ingresos_mes || 0,
          eficiencia: data.conteos.eficiencia || 0
        });

        // Actualizar resumen de citas
        setCitasResumen({
          programadas: data.citas_hoy_por_estado.programadas || 0,
          completadas: data.citas_hoy_por_estado.completadas || 0,
          pendientes: data.citas_hoy_por_estado.pendientes || 0,
          canceladas: data.citas_hoy_por_estado.canceladas || 0
        });

        // Procesar actividad reciente
        if (data.actividad_reciente && Array.isArray(data.actividad_reciente)) {
          const actividades = data.actividad_reciente.slice(0, 4).map(activity => ({
            id: activity.id,
            action: activity.accion || 'Actividad del sistema',
            user: activity.usuario || 'Sistema',
            time: formatTimeAgo(activity.created_at),
            type: activity.tipo || getActivityType(activity.accion || '')
          }));
          setActividadReciente(actividades);
        } else {
          // Datos de ejemplo si no hay actividad
          setActividadReciente([
            {
              id: 1,
              action: 'Sistema funcionando correctamente',
              user: 'Sistema',
              time: 'Hace unos momentos',
              type: 'system'
            }
          ]);
        }
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Error al cargar datos del dashboard');
      showToast('Error al cargar datos del dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear tiempo relativo
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Hace un momento';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Hace un momento';
      if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    } catch {
      return 'Hace un momento';
    }
  };

  // Función para determinar el tipo de actividad
  const getActivityType = (accion) => {
    if (!accion) return 'system';
    
    const action = accion.toLowerCase();
    if (action.includes('cita')) return 'appointment';
    if (action.includes('usuario') || action.includes('registro')) return 'user';
    if (action.includes('pago')) return 'payment';
    if (action.includes('login')) return 'auth';
    return 'system';
  };

  // Función para refrescar datos
  const refreshData = () => {
    fetchDashboardData();
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    citasResumen,
    actividadReciente,
    loading,
    error,
    refreshData
  };
};

export default useDashboard;