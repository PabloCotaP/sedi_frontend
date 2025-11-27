import { checkSession, logout as logoutAPI } from './api';

function clearAuth() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_picture');
}

export async function isAuthenticated(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    const response = await checkSession();
    
    if (response.status === 'success' && response.user) {
      localStorage.setItem('user_email', response.user.correo);
      localStorage.setItem('user_name', response.user.nombre);
      return true;
    }
    
    clearAuth();
    return false;
  } catch (error) {
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
    console.error('Error al cerrar sesión:', error);
  } finally {
    clearAuth();
    window.location.href = '/';
  }
}

export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    window.location.href = '/';
  }
}
