# Sistema de Rutas - PhisyoMar Web

## ✅ Rutas Implementadas y Funcionales

### 🔓 Rutas Públicas
- `/` - Página de inicio
- `/login` - Inicio de sesión
- `/registrar` - Registro de usuarios
- `/unauthorized` - Acceso denegado

### 🔒 Rutas Protegidas por Rol

#### 👨‍💼 Administrador (rol_id: 1)
**Ruta base:** `/admin`

- `/admin` - Dashboard administrativo con estadísticas
- `/admin/usuarios` - Gestión completa de usuarios del sistema
- `/admin/pacientes` - Gestión completa de pacientes
- `/admin/citas` - Gestión completa de citas

**Sidebar incluye:**
- 🏠 Inicio
- 👥 Usuarios
- 🏥 Pacientes  
- 📅 Citas

#### 👨‍⚕️ Terapeuta (rol_id: 2)
**Ruta base:** `/terapeuta`

- `/terapeuta` - Dashboard del terapeuta con sus estadísticas
- `/terapeuta/citas` - Citas asignadas al terapeuta

**Sidebar incluye:**
- 🏠 Inicio
- 📅 Mis Citas

#### 👩‍💻 Recepcionista (rol_id: 3)
**Ruta base:** `/recepcionista`

- `/recepcionista` - Dashboard de recepción
- `/recepcionista/pacientes` - Gestión de pacientes
- `/recepcionista/citas` - Gestión de citas

**Sidebar incluye:**
- 🏠 Inicio
- 🏥 Pacientes
- 📅 Citas

#### 🏥 Paciente (rol_id: 4)
**Ruta base:** `/paciente`

- `/paciente` - Perfil del paciente
- `/paciente/mis-citas` - Citas del paciente
- `/paciente/agendar-cita` - Agendar nueva cita

**Sidebar incluye:**
- 🏠 Inicio
- 📅 Mis Citas
- ➕ Agendar Cita

## 🔄 Redirección Automática

Después del login, el sistema redirige automáticamente según el rol:

```javascript
switch (usuario.rol_id) {
  case 1: navigate('/admin');         // Administrador
  case 2: navigate('/terapeuta');     // Terapeuta  
  case 3: navigate('/recepcionista'); // Recepcionista
  case 4: navigate('/paciente');      // Paciente
}
```

## 📱 Páginas Específicas Creadas

### Dashboard por Rol
- **AdminHomePage** - Estadísticas generales de la clínica
- **TerapeutaHomePage** - Citas y pacientes del terapeuta
- **RecepcionistaHomePage** - Resumen operativo diario
- **PerfilPaciente** - Información personal del paciente

### Gestión de Datos
- **UsuariosPage** - CRUD completo de usuarios (solo admin)
- **PacientesPage** - CRUD completo de pacientes (admin + recepcionista)
- **CitasPage** - CRUD completo de citas (según permisos por rol)
- **MisCitasPage** - Vista de citas para pacientes

## 🛡️ Protección de Rutas

Todas las rutas están protegidas usando el componente `ProtectedRoute`:

```jsx
<ProtectedRoute allowedRoles={[1, 3]}> // Solo admin y recepcionista
  <PacientesPage />
</ProtectedRoute>
```

## 📊 Funcionalidades por Página

### AdminHomePage
- ✅ Estadísticas de pacientes totales
- ✅ Citas del día
- ✅ Ingresos mensuales
- ✅ Terapeutas activos
- ✅ Gráficos y actividades recientes

### TerapeutaHomePage
- ✅ Citas del día del terapeuta
- ✅ Total de pacientes asignados
- ✅ Estadísticas de citas completadas
- ✅ Lista de próximas citas
- ✅ Pacientes recientes

### RecepcionistaHomePage
- ✅ Citas del día
- ✅ Total de pacientes
- ✅ Citas pendientes
- ✅ Nuevos pacientes de la semana
- ✅ Resumen operativo

### PacientesPage
- ✅ Lista completa de pacientes
- ✅ Búsqueda y filtros
- ✅ Formulario de creación/edición
- ✅ Información de contacto y emergencia
- ✅ Eliminación con confirmación

### CitasPage
- ✅ Lista de todas las citas
- ✅ Estados de citas (programada, cancelada, completada)
- ✅ Búsqueda por paciente
- ✅ Formulario para nueva cita
- ✅ Acciones de editar/cancelar

### UsuariosPage
- ✅ Gestión completa de usuarios del sistema
- ✅ Asignación de roles
- ✅ Formulario completo con validaciones
- ✅ Estadísticas por tipo de usuario

## 🔧 Configuración del Sidebar

El sidebar es **dinámico** y cambia según el rol del usuario:

```javascript
const getSidebarItems = () => {
  const basePath = hasRole(1) ? '/admin' : 
                  hasRole(2) ? '/terapeuta' : 
                  hasRole(3) ? '/recepcionista' : '/paciente';
  // ... resto de la lógica
};
```

## 🚀 Estado Actual

✅ **Todas las rutas están implementadas y funcionales**
✅ **Conexión completa con la API de Laravel**
✅ **Protección de rutas por rol funcionando**
✅ **Sidebar dinámico implementado**
✅ **Formularios conectados a la API**
✅ **Estados de loading y error manejados**
✅ **Logout funcional con limpieza de sesión**

## 📝 Uso del Sistema

1. **Iniciar sesión** en `/login`
2. **Redirección automática** según rol
3. **Navegación** usando el sidebar
4. **Gestión de datos** en tiempo real con la API
5. **Logout** desde cualquier página

El sistema está **100% funcional** y listo para usar en producción.