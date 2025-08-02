import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useToast } from '../hooks/useToast';
import { roleManagementService } from '../services/roleManagementService';
import LoadingSpinner from '../components/LoadingSpinner';

const RoleManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    rol_id: '',
    estatus: '',
    search: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);
  const [showChangeStatusModal, setShowChangeStatusModal] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [filters, pagination.current_page]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [rolesResponse, statsResponse] = await Promise.all([
        roleManagementService.getRoles(),
        roleManagementService.getUserStats()
      ]);

      setRoles(rolesResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      showToast('Error al cargar datos iniciales', 'error');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await roleManagementService.getUsers({
        ...filters,
        page: pagination.current_page
      });

      setUsers(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total
      });
    } catch (error) {
      showToast('Error al cargar usuarios', 'error');
      console.error('Error:', error);
    }
  };

  const handleChangeRole = async (userId, newRoleId, motivo = '') => {
    try {
      await roleManagementService.changeUserRole(userId, {
        rol_id: newRoleId,
        motivo
      });

      showToast('Rol cambiado exitosamente', 'success');
      fetchUsers();
      fetchInitialData(); // Actualizar estadísticas
      setShowChangeRoleModal(false);
      setSelectedUser(null);
    } catch (error) {
      showToast(error.message || 'Error al cambiar rol', 'error');
    }
  };

  const handleChangeStatus = async (userId, newStatus, motivo = '') => {
    try {
      await roleManagementService.toggleUserStatus(userId, {
        estatus: newStatus,
        motivo
      });

      showToast('Estado cambiado exitosamente', 'success');
      fetchUsers();
      fetchInitialData(); // Actualizar estadísticas
      setShowChangeStatusModal(false);
      setSelectedUser(null);
    } catch (error) {
      showToast(error.message || 'Error al cambiar estado', 'error');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'activo':
        return 'bg-green-100 text-green-800';
      case 'inactivo':
        return 'bg-gray-100 text-gray-800';
      case 'suspendido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadgeColor = (roleName) => {
    switch (roleName) {
      case 'Administrador':
        return 'bg-purple-100 text-purple-800';
      case 'Terapeuta':
        return 'bg-blue-100 text-blue-800';
      case 'Recepcionista':
        return 'bg-yellow-100 text-yellow-800';
      case 'Paciente':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Roles</h1>
          <p className="text-gray-600">Administra usuarios y sus roles en el sistema</p>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(stats).map(([roleName, data]) => (
          <Card key={roleName} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{roleName}</p>
                <p className="text-2xl font-bold text-gray-900">{data.total}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-600">
                  Activos: {data.activo || 0}
                </div>
                <div className="text-sm text-gray-500">
                  Inactivos: {(data.inactivo || 0) + (data.suspendido || 0)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nombre, email..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.rol_id}
              onChange={(e) => setFilters({ ...filters, rol_id: e.target.value })}
            >
              <option value="">Todos los roles</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.estatus}
              onChange={(e) => setFilters({ ...filters, estatus: e.target.value })}
            >
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button
              onClick={() => {
                setFilters({ rol_id: '', estatus: '', search: '' });
                setPagination({ ...pagination, current_page: 1 });
              }}
              variant="outline"
              className="w-full"
            >
              Limpiar
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabla de usuarios */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.nombre.charAt(0)}{user.apellido_paterno.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.nombre} {user.apellido_paterno} {user.apellido_materno}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.correo_electronico}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getRoleBadgeColor(user.rol?.name)}>
                      {user.rol?.name || 'Sin rol'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStatusBadgeColor(user.estatus)}>
                      {user.estatus}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowChangeRoleModal(true);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cambiar Rol
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowChangeStatusModal(true);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cambiar Estado
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {pagination.last_page > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                onClick={() => setPagination({ ...pagination, current_page: pagination.current_page - 1 })}
                disabled={pagination.current_page === 1}
                variant="outline"
              >
                Anterior
              </Button>
              <Button
                onClick={() => setPagination({ ...pagination, current_page: pagination.current_page + 1 })}
                disabled={pagination.current_page === pagination.last_page}
                variant="outline"
              >
                Siguiente
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{((pagination.current_page - 1) * 20) + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(pagination.current_page * 20, pagination.total)}
                  </span>{' '}
                  de <span className="font-medium">{pagination.total}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setPagination({ ...pagination, current_page: page })}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.current_page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Modal para cambiar rol */}
      {showChangeRoleModal && selectedUser && (
        <ChangeRoleModal
          user={selectedUser}
          roles={roles}
          onClose={() => {
            setShowChangeRoleModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleChangeRole}
        />
      )}

      {/* Modal para cambiar estado */}
      {showChangeStatusModal && selectedUser && (
        <ChangeStatusModal
          user={selectedUser}
          onClose={() => {
            setShowChangeStatusModal(false);
            setSelectedUser(null);
          }}
          onConfirm={handleChangeStatus}
        />
      )}
    </div>
  );
};

// Modal para cambiar rol
const ChangeRoleModal = ({ user, roles, onClose, onConfirm }) => {
  const [selectedRole, setSelectedRole] = useState(user.rol?.id || '');
  const [motivo, setMotivo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(user.id, selectedRole, motivo);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Cambiar Rol de Usuario
        </h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <strong>Usuario:</strong> {user.nombre} {user.apellido_paterno}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Rol actual:</strong> {user.rol?.name || 'Sin rol'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo Rol
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo del cambio (opcional)
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Describe el motivo del cambio de rol..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={onClose} variant="outline">
              Cancelar
            </Button>
            <Button type="submit">
              Cambiar Rol
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para cambiar estado
const ChangeStatusModal = ({ user, onClose, onConfirm }) => {
  const [selectedStatus, setSelectedStatus] = useState(user.estatus);
  const [motivo, setMotivo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(user.id, selectedStatus, motivo);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Cambiar Estado de Usuario
        </h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            <strong>Usuario:</strong> {user.nombre} {user.apellido_paterno}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Estado actual:</strong> {user.estatus}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nuevo Estado
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo del cambio (opcional)
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Describe el motivo del cambio de estado..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={onClose} variant="outline">
              Cancelar
            </Button>
            <Button type="submit">
              Cambiar Estado
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleManagementPage;