// src/pages/UsuariosPage.jsx
import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  MoreVertical,
  UserCheck,
  UserX,
  Eye,
  Download
} from "lucide-react";

const usuariosMock = [
  { 
    id: 1, 
    nombre: "Juan Pérez", 
    correo: "juan@mail.com", 
    telefono: "+52 229 123 4567",
    fechaRegistro: "2024-01-15",
    status: "activo",
    avatar: "JP",
    ultimaVisita: "2024-07-01"
  },
  { 
    id: 2, 
    nombre: "Ana López", 
    correo: "ana@mail.com", 
    telefono: "+52 229 987 6543",
    fechaRegistro: "2024-02-20",
    status: "inactivo",
    avatar: "AL",
    ultimaVisita: "2024-06-15"
  },
  { 
    id: 3, 
    nombre: "Carlos Mendoza", 
    correo: "carlos@mail.com", 
    telefono: "+52 229 456 7890",
    fechaRegistro: "2024-03-10",
    status: "activo",
    avatar: "CM",
    ultimaVisita: "2024-07-05"
  },
  { 
    id: 4, 
    nombre: "María García", 
    correo: "maria@mail.com", 
    telefono: "+52 229 321 6547",
    fechaRegistro: "2024-04-05",
    status: "pendiente",
    avatar: "MG",
    ultimaVisita: "2024-06-28"
  },
];

export default function UsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const filteredUsers = usuariosMock.filter(user => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.correo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "todos" || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case "activo": return "bg-green-100 text-green-800 border-green-200";
      case "inactivo": return "bg-red-100 text-red-800 border-red-200";
      case "pendiente": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "activo": return <UserCheck className="w-4 h-4" />;
      case "inactivo": return <UserX className="w-4 h-4" />;
      case "pendiente": return <Calendar className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Usuarios
                </h1>
                <p className="text-slate-600 mt-1">Gestiona los pacientes de tu clínica</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-medium">
              <Plus className="w-5 h-5" />
              Nuevo Usuario
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Usuarios</p>
                  <p className="text-3xl font-bold text-slate-800">{usuariosMock.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Activos</p>
                  <p className="text-3xl font-bold text-green-600">
                    {usuariosMock.filter(u => u.status === "activo").length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Inactivos</p>
                  <p className="text-3xl font-bold text-red-600">
                    {usuariosMock.filter(u => u.status === "inactivo").length}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <UserX className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Pendientes</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {usuariosMock.filter(u => u.status === "pendiente").length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    className="w-full pl-10 pr-4 py-3 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <select
                    className="appearance-none bg-white/50 border border-white/20 rounded-xl pl-10 pr-8 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="todos">Todos</option>
                    <option value="activo">Activos</option>
                    <option value="inactivo">Inactivos</option>
                    <option value="pendiente">Pendientes</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-3 rounded-xl transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="py-4 px-6 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700">Usuario</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700">Contacto</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700">Registro</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700">Estado</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700">Última Visita</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-slate-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{user.nombre}</p>
                          <p className="text-sm text-slate-600">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          {user.correo}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4" />
                          {user.telefono}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.fechaRegistro).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                        {getStatusIcon(user.status)}
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-slate-600">
                        {new Date(user.ultimaVisita).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No se encontraron usuarios</h3>
              <p className="text-slate-500">Intenta ajustar los filtros de búsqueda</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="mt-8 flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="text-sm text-slate-600">
              Mostrando {filteredUsers.length} de {usuariosMock.length} usuarios
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white/50 border border-white/20 rounded-lg hover:bg-white/80 transition-colors text-sm font-medium">
                Anterior
              </button>
              <span className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">1</span>
              <button className="px-4 py-2 bg-white/50 border border-white/20 rounded-lg hover:bg-white/80 transition-colors text-sm font-medium">
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
