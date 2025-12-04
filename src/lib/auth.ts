import { checkSession, logout as logoutAPI } from './api';

function clearAuth() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('user_email');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_picture');
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_rol');
}

export async function isAuthenticated(): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const token = localStorage.getItem('access_token');
  
  if (!token) {
    clearAuth();
    return false;
  }

  const userId = localStorage.getItem('user_id');
  const userEmail = localStorage.getItem('user_email');
  
  if (userId && userEmail) {
    return true;
  }

  try {
    const response = await checkSession();

    if (response.status === 'success' && response.user) {
      localStorage.setItem('user_email', response.user.correo);
      localStorage.setItem('user_name', response.user.nombre);
      localStorage.setItem('user_id', response.user.id.toString());
      localStorage.setItem('user_rol', response.user.rol);
      return true;
    }

    clearAuth();
    return false;
  } catch (error: any) {
    clearAuth();
    return false;
  }
}

export function getUser() {
  if (typeof window === 'undefined') return null;

  return {
    email: localStorage.getItem('user_email'),
    name: localStorage.getItem('user_name'),
    picture: localStorage.getItem('user_picture'),
  };
}

export async function logout() {
  try {
    await logoutAPI();
  } catch (error) {
  } finally {
    clearAuth();
    window.location.href = '/';
  }
}

export async function requireAuth() {
  await new Promise(resolve => setTimeout(resolve, 50));
  
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    window.location.href = '/';
  }
}
