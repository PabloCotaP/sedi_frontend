function clearAuth() {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_name');
  localStorage.removeItem('user_picture');
  localStorage.removeItem('google_token');
  localStorage.removeItem('auth_timestamp');
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const email = localStorage.getItem('user_email');
  const token = localStorage.getItem('google_token');
  const timestamp = localStorage.getItem('auth_timestamp');
  
  console.log('Verificando autenticación:', { email, hasToken: !!token, timestamp });
  
  if (!email || !token || !timestamp) {
    console.log('Faltan datos de autenticación');
    return false;
  }
  
  if (!email.endsWith('@uabc.edu.mx')) {
    console.error('Email no válido:', email);
    clearAuth();
    return false;
  }
  
  const sessionAge = Date.now() - parseInt(timestamp);
  const maxAge = 24 * 60 * 60 * 1000;
  
  if (sessionAge > maxAge) {
    console.log('Sesión expirada');
    clearAuth();
    return false;
  }
  
  console.log('Autenticación válida');
  return true;
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  
  return {
    email: localStorage.getItem('user_email'),
    name: localStorage.getItem('user_name'),
    picture: localStorage.getItem('user_picture'),
  };
}

export function logout() {
  clearAuth();
  window.location.href = '/';
}

export function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = '/';
  }
}