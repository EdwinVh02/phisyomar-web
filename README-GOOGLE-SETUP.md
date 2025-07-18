# Configuración de Google OAuth

## ✅ Ya configurado en tu proyecto

### Client ID actual:
```
869395496053-61ufvj5kspfoa9kahldrci025rvjaok9.apps.googleusercontent.com
```

## 🔧 Configuración en Google Cloud Console

### 1. Orígenes JavaScript autorizados
Agrega estos dominios en Google Cloud Console:

**Para desarrollo local:**
```
http://localhost:5173
http://localhost:5174
http://localhost:3000
```

**Para producción:**
```
https://tudominio.com
https://www.tudominio.com
```

### 2. URIs de redirección autorizados
```
http://localhost:5173/login
http://localhost:5174/login
https://tudominio.com/login
https://www.tudominio.com/login
```

## 🚀 Solución al error FedCM

El error que experimentaste es común en desarrollo local. La solución implementada:

1. **Deshabilitamos FedCM** con `use_fedcm_for_prompt: false`
2. **Usamos renderButton** en lugar de prompt() 
3. **Modal personalizado** que evita restricciones del navegador

## 📱 Cómo funciona ahora

1. Click en "Iniciar sesión con Google"
2. Aparece un modal con el botón oficial de Google
3. Click en el botón azul de Google
4. Se abre popup de autenticación
5. Autorización → Login automático

## 🔒 Configuración de producción

Para producción, agrega estos headers de seguridad:

```php
// En tu servidor web
Content-Security-Policy: frame-ancestors 'self' https://accounts.google.com
X-Frame-Options: SAMEORIGIN
```

## 🎯 Testing local

Para probar localmente:
1. Ve a `http://localhost:5174/login`
2. Click en "Iniciar sesión con Google"
3. Aparece modal → Click en botón azul
4. Login con tu cuenta Google
5. Redirección automática según tu rol

## 🔧 Troubleshooting

### Error "origin_mismatch"
- Verifica que tu dominio esté en Google Console
- Asegúrate de usar el protocolo correcto (http/https)

### Error "popup_blocked"
- Permite popups en tu navegador
- Asegúrate de que el click sea iniciado por el usuario

### Error "invalid_client"
- Verifica el Client ID en .env.local
- Confirma que el proyecto esté habilitado en Google Console