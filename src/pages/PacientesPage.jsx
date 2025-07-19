import React, { useState } from "react";
import { usePacientes } from "../hooks/usePacientes";
import { Search, Plus, Edit2, Trash2, Eye, Phone, Mail } from "lucide-react";

export default function PacientesPage() {
  const { pacientes, loading, error, crear, actualizar, eliminar } = usePacientes();
  const [searchTerm, setSearchTerm] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [pacienteEditando, setPacienteEditando] = useState(null);
  const [formData, setFormData] = useState({
    usuario: {
      nombre: '',
      apellido_paterno: '',
      apellido_materno: '',
      correo_electronico: '',
      contraseña: '',
      rol_id: 4 // Paciente
    },
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
    contacto_emergencia: '',
    telefono_emergencia: ''
  });

  const pacientesFiltrados = pacientes.filter(paciente => {
    const nombre = `${paciente.usuario?.nombre} ${paciente.usuario?.apellido_paterno} ${paciente.usuario?.apellido_materno}`.toLowerCase();
    const email = paciente.usuario?.correo_electronico?.toLowerCase() || '';
    return nombre.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
  });

  const handleCrearPaciente = () => {
    setPacienteEditando(null);
    setFormData({
      usuario: {
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        correo_electronico: '',
        contraseña: '',
        rol_id: 4
      },
      fecha_nacimiento: '',
      telefono: '',
      direccion: '',
      contacto_emergencia: '',
      telefono_emergencia: ''
    });
    setMostrarFormulario(true);
  };

  const handleEditarPaciente = (paciente) => {
    setPacienteEditando(paciente);
    setFormData({
      usuario: {
        nombre: paciente.usuario?.nombre || '',
        apellido_paterno: paciente.usuario?.apellido_paterno || '',
        apellido_materno: paciente.usuario?.apellido_materno || '',
        correo_electronico: paciente.usuario?.correo_electronico || '',
        contraseña: '',
        rol_id: 4
      },
      fecha_nacimiento: paciente.fecha_nacimiento || '',
      telefono: paciente.telefono || '',
      direccion: paciente.direccion || '',
      contacto_emergencia: paciente.contacto_emergencia || '',
      telefono_emergencia: paciente.telefono_emergencia || ''
    });
    setMostrarFormulario(true);
  };

  const handleEliminarPaciente = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este paciente?")) {
      try {
        await eliminar(id);
        alert("Paciente eliminado exitosamente");
      } catch (error) {
        alert("Error al eliminar paciente: " + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (pacienteEditando) {
        const dataToSend = { ...formData, usuario: { ...formData.usuario } };
        if (!dataToSend.usuario.contraseña) {
          delete dataToSend.usuario.contraseña;
        }
        await actualizar(pacienteEditando.id, dataToSend);
        alert("Paciente actualizado exitosamente");
      } else {
        await crear(formData);
        alert("Paciente creado exitosamente");
      }
      setMostrarFormulario(false);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('usuario.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        usuario: {
          ...prev.usuario,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando pacientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>Error al cargar pacientes: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Pacientes</h1>
            <p className="text-gray-600">Administra la información de los pacientes</p>
          </div>
          <button
            onClick={handleCrearPaciente}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nuevo Paciente
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar pacientes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de pacientes */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Paciente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Nacimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pacientesFiltrados.map((paciente) => (
                <tr key={paciente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {paciente.usuario?.nombre?.charAt(0)?.toUpperCase() || 'P'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {paciente.usuario?.nombre} {paciente.usuario?.apellido_paterno} {paciente.usuario?.apellido_materno}
                        </div>
                        <div className="text-sm text-gray-500">ID: {paciente.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2" />
                        {paciente.usuario?.correo_electronico}
                      </div>
                      {paciente.telefono && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 mr-2" />
                          {paciente.telefono}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {paciente.fecha_nacimiento ? new Date(paciente.fecha_nacimiento).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(paciente.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditarPaciente(paciente)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEliminarPaciente(paciente.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pacientesFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron pacientes.</p>
          </div>
        )}
      </div>

      {/* Modal de formulario */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {pacienteEditando ? 'Editar Paciente' : 'Nuevo Paciente'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="usuario.nombre"
                    value={formData.usuario.nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido Paterno *
                  </label>
                  <input
                    type="text"
                    name="usuario.apellido_paterno"
                    value={formData.usuario.apellido_paterno}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apellido Materno
                  </label>
                  <input
                    type="text"
                    name="usuario.apellido_materno"
                    value={formData.usuario.apellido_materno}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="usuario.correo_electronico"
                    value={formData.usuario.correo_electronico}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña {pacienteEditando && '(dejar en blanco para no cambiar)'}
                  </label>
                  <input
                    type="password"
                    name="usuario.contraseña"
                    value={formData.usuario.contraseña}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!pacienteEditando}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <textarea
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contacto de Emergencia
                  </label>
                  <input
                    type="text"
                    name="contacto_emergencia"
                    value={formData.contacto_emergencia}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono de Emergencia
                  </label>
                  <input
                    type="tel"
                    name="telefono_emergencia"
                    value={formData.telefono_emergencia}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {pacienteEditando ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}