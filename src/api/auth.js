// Iniciar sesión y obtener token\export async function loginUser(email, password) {
export async function loginUser(email, password) {
  const response = await fetch('http://localhost:8000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Credenciales inválidas');
  }

  return data;
}


// Obtener usuario autenticado (requiere token en localStorage)
export async function getAuthenticatedUser() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No autenticado');

  const response = await fetch('http://localhost:8000/api/user-authenticated', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error al obtener el usuario');
  }

  return data.user;
}

// Cerrar sesión (elimina el token)
export function logoutUser() {
  localStorage.removeItem('token');
}
