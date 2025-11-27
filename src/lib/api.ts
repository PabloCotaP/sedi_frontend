const API_BASE_URL = 'http://localhost:8000/api';

export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function loginWithGoogle(idToken: string) {
  return fetchAPI<{
    status: string;
    message?: string;
    user?: {
      id: number;
      nombre: string;
      correo: string;
      rol: string;
    };
  }>('/login', {
    method: 'POST',
    body: JSON.stringify({ id_token: idToken }),
  });
}

export async function checkSession() {
  return fetchAPI<{
    status: string;
    user: {
      id: number;
      nombre: string;
      correo: string;
      rol: string;
    };
  }>('/user');
}

export async function logout() {
  return fetchAPI<{
    status: string;
    message: string;
  }>('/logout', {
    method: 'POST',
  });
}
