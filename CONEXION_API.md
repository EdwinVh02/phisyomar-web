# Configuración de Conexión API - PhisyoMar Web

## Configuración completada

### 1. Configuración de Axios
- ✅ Archivo `src/services/api.js` configurado con interceptors
- ✅ URL base: `http://localhost:8000/api`
- ✅ Interceptors para token automático y manejo de errores

### 2. Servicios API creados
- ✅ `src/services/pacienteService.js` - Gestión de pacientes
- ✅ `src/services/citaService.js` - Gestión de citas
- ✅ `src/services/terapeutaService.js` - Gestión de terapeutas  
- ✅ `src/services/especialidadService.js` - Gestión de especialidades
- ✅ `src/services/usuarioService.js` - Gestión de usuarios
- ✅ `src/services/historialService.js` - Gestión de historiales médicos
- ✅ `src/services/index.js` - Exportación centralizada

### 3. Hooks personalizados
- ✅ `src/hooks/useCitas.js` - Hook para manejo de citas
- ✅ `src/hooks/usePacientes.js` - Hook para manejo de pacientes
- ✅ `src/hooks/useUsuarios.js` - Hook para manejo de usuarios

### 4. Store de autenticación mejorado
- ✅ `src/store/authStore.js` - Store Zustand con persistencia
- ✅ Manejo de roles y permisos
- ✅ Inicialización automática desde localStorage

### 5. Componentes actualizados
- ✅ `src/pages/Login.jsx` - Login funcional con API
- ✅ `src/pages/MisCitas.jsx` - Citas con datos reales
- ✅ `src/components/ProtectedRoute.jsx` - Protección de rutas por rol
- ✅ `src/pages/Unauthorized.jsx` - Página de acceso denegado

### 6. Configuración de App
- ✅ `src/App.jsx` - Inicialización del store de auth

## Endpoints disponibles

### Autenticación
- `POST /login` - Iniciar sesión
- `POST /register` - Registrar usuario
- `POST /logout` - Cerrar sesión
- `GET /user` - Obtener usuario autenticado

### Pacientes (Roles: Admin, Recepcionista)
- `GET /pacientes` - Lista de pacientes
- `POST /pacientes` - Crear paciente
- `PUT /pacientes/{id}` - Actualizar paciente
- `DELETE /pacientes/{id}` - Eliminar paciente

### Citas
- `GET /citas` - Lista de citas (Admin, Recepcionista, Terapeuta)
- `POST /citas` - Crear cita
- `GET /paciente/mis-citas` - Mis citas (Paciente)
- `POST /paciente/agendar-cita` - Agendar cita (Paciente)
- `PUT /paciente/cancelar-cita/{id}` - Cancelar cita (Paciente)

### Usuarios (Solo Admin)
- `GET /usuarios` - Lista de usuarios
- `POST /usuarios` - Crear usuario
- `PUT /usuarios/{id}` - Actualizar usuario
- `DELETE /usuarios/{id}` - Eliminar usuario

## Roles del sistema
- **1** - Administrador
- **2** - Terapeuta  
- **3** - Recepcionista
- **4** - Paciente

## Instrucciones de uso

### 1. Asegurar que el backend esté ejecutándose
```bash
cd phisyomarv2
php artisan serve
```

### 2. Ejecutar el frontend
```bash
cd phisyomar-web
npm run dev
```

### 3. Configurar CORS en Laravel (si es necesario)
En `phisyomarv2/config/cors.php`:
```php
'allowed_origins' => ['http://localhost:5173'],
```

### 4. Variables de entorno
Crear `.env.local` en phisyomar-web (opcional):
```
VITE_API_URL=http://localhost:8000/api
```

## Funcionalidades implementadas

### Para Pacientes
- ✅ Login/Logout
- ✅ Ver mis citas
- ✅ Agendar nuevas citas
- ✅ Cancelar citas

### Para Administradores
- ✅ Gestión completa de usuarios
- ✅ Gestión de pacientes
- ✅ Gestión de citas
- ✅ Dashboard administrativo

### Para Recepcionistas
- ✅ Gestión de pacientes
- ✅ Gestión de citas
- ✅ Dashboard operativo

### Para Terapeutas
- ✅ Ver mis citas asignadas
- ✅ Ver mis pacientes
- ✅ Dashboard terapéutico

## Próximos pasos sugeridos

1. **Validación de formularios** - Agregar validación robusta
2. **Notificaciones** - Implementar sistema de notificaciones
3. **Paginación** - Agregar paginación a las listas
4. **Filtros avanzados** - Mejorar filtros de búsqueda
5. **Carga de archivos** - Implementar subida de documentos
6. **Reportes** - Agregar generación de reportes

## Estructura de archivos API

```
src/
├── api/
│   └── auth.js              # Funciones de autenticación
├── services/
│   ├── api.js              # Configuración de axios
│   ├── pacienteService.js  # Servicios de pacientes
│   ├── citaService.js      # Servicios de citas
│   ├── terapeutaService.js # Servicios de terapeutas
│   ├── usuarioService.js   # Servicios de usuarios
│   └── index.js            # Exportaciones centralizadas
├── hooks/
│   ├── useCitas.js         # Hook de citas
│   ├── usePacientes.js     # Hook de pacientes
│   └── useUsuarios.js      # Hook de usuarios
├── store/
│   └── authStore.js        # Store de autenticación
└── components/
    └── ProtectedRoute.jsx  # Componente de protección de rutas
```

La conexión entre el frontend React y el backend Laravel está completamente configurada y lista para usar.