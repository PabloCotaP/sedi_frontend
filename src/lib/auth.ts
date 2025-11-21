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
  
  if (!email || !token || !timestamp) {
    return false;
  }
  
  if (!email.endsWith('@uabc.edu.mx')) {
    clearAuth();
    return false;
  }
  
  const sessionAge = Date.now() - parseInt(timestamp);
  const maxAge = 24 * 60 * 60 * 1000;
  
  if (sessionAge > maxAge) {
    clearAuth();
    return false;
  }
  
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
