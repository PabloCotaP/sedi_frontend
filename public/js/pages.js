const API_BASE_URL = 'http://localhost:8000/api';

function getAccessToken() {
  return localStorage.getItem('access_token');
}

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAccessToken();
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const defaultOptions = {
    credentials: 'include',
    headers: headers,
  };
  const response = await fetch(url, { ...defaultOptions, ...options });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}`);
  }
  return response.json();
}

(async function(){
  const token = getAccessToken();
  if (!token) {
    window.location.href = '/';
    return;
  }
  
  const headerEmailElement = document.querySelector('header p.text-sm.opacity-90');
  
  try {
    const session = await fetchAPI('/user');
    if (session.status === 'success' && session.user) {
      if (headerEmailElement) {
        headerEmailElement.textContent = session.user.correo;
      }
      localStorage.setItem('user_email', session.user.correo);
      localStorage.setItem('user_id', session.user.id);
      localStorage.setItem('user_rol', session.user.rol);
    }
  } catch (error) {
    const savedEmail = localStorage.getItem('user_email');
    if (headerEmailElement && savedEmail) {
      headerEmailElement.textContent = savedEmail;
    }
  }
})();
