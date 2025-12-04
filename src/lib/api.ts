const API_BASE_URL = 'http://localhost:8000/api';

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAccessToken();

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: defaultHeaders,
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Si es error 401 (no autorizado), limpiar el token
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
    }
    
    throw new Error(errorData.message || errorData.error || `Error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export async function loginWithGoogle(idToken: string) {
  return fetchAPI<{
    status: string;
    message?: string;
    token?: string;
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

export interface Usuario {
  id_usuario: number;
  correo: string;
  nombre: string;
  ap_pat: string;
  ap_mat: string;
  fecha_nacimiento: string;
  fecha_contratacion: string;
  activo: boolean;
  carrera_id_carrera: number;
  roles_id_role: number;
  nombramiento_idnombramiento: number;
}

export interface Pais {
  idpais: number;
  pais: string;
}

export interface Institucion {
  idinstitucion: number;
  nombre: string;
}

export interface NivelFormacion {
  id_niveles: number;
  nivel: string;
}

export interface Formacion {
  id_formacion: number;
  niveles_id_niveles: number;
  formacion: string;
  anio_obtencion: number;
  cedula: string | null;
  fecha_registro: string;
  usuarios_id_usuario: number;
  pais_idpais: number;
  institucion_idinstitucion: number;
  niveles_id_niveles_rel?: NivelFormacion;
  pais_idpais_rel?: Pais;
  institucion_idinstitucion_rel?: Institucion;
}

export interface InfoExtra {
  idinfo_extra: number;
  anio_obtencion: number;
  horas: number;
  nivel_experiencia: string;
  fecha_inicio: string;
  fecha_final: string;
  puesto: string;
  documento_detalle_iddocumento_detalle: number;
}

export interface Registro {
  id_registro: number;
  usuario_id_usuario: number;
  tipos_documento_id_tipo_documento: number;
  estado: string;
}

export interface DocumentoDetalle {
  id_documento_detalle: number;
  registro_id_registro: number;
  url_archivo: string;
  nombre_archivo: string;
  fecha_subida: string;
  estado_validacion: string;
}

export async function getAllUsers() {
  return fetchAPI<{
    status: string;
    users: Usuario[];
  }>('/User/getAll');
}

export async function getUserById(id: number) {
  return fetchAPI<{
    status: string;
    user: Usuario;
  }>(`/User/get/${id}`);
}

export async function getCurrentUser() {
  return fetchAPI<{
    status: string;
    user: Usuario;
  }>('/User/get');
}

export async function updateUser(id: number, data: Partial<Usuario>) {
  return fetchAPI<{
    status: string;
    message: string;
    user: Usuario;
  }>(`/User/updateUser/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getAllPaises() {
  return fetchAPI<{
    status: string;
    data: Pais[];
  }>('/Pais/getAll');
}

export async function getAllInstituciones() {
  return fetchAPI<{
    status: string;
    data: Institucion[];
  }>('/Institucion/getAll');
}

export async function getMyFormaciones() {
  return fetchAPI<{
    status: string;
    data: Formacion[];
  }>('/Formacion/getMy');
}

export async function insertFormacion(data: {
  niveles_id_niveles: number;
  formacion: string;
  anio_obtencion: number;
  cedula?: string;
  pais_idpais: number;
  institucion_idinstitucion: number;
}) {
  return fetchAPI<{
    status: string;
    message: string;
    data: Formacion;
  }>('/Formacion/insert', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateFormacion(id: number, data: Partial<Formacion>) {
  return fetchAPI<{
    status: string;
    message: string;
    data: Formacion;
  }>(`/Formacion/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteFormacion(id: number) {
  return fetchAPI<{
    status: string;
    message: string;
  }>(`/Formacion/delete/${id}`, {
    method: 'DELETE',
  });
}

export async function getAllInfoExtra() {
  return fetchAPI<InfoExtra[]>('/info-extra');
}

export async function getInfoExtraById(id: number) {
  return fetchAPI<InfoExtra>(`/info-extra/${id}`);
}

export async function insertInfoExtra(data: Omit<InfoExtra, 'idinfo_extra'>) {
  return fetchAPI<{
    message: string;
    data: InfoExtra;
  }>('/info-extra', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateInfoExtra(id: number, data: Omit<InfoExtra, 'idinfo_extra'>) {
  return fetchAPI<{
    message: string;
    data: InfoExtra;
  }>(`/info-extra/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteInfoExtra(id: number) {
  return fetchAPI<{
    message: string;
  }>(`/info-extra/${id}`, {
    method: 'DELETE',
  });
}

export async function getRegistros() {
  return fetchAPI<Registro[]>('/registro');
}

export async function getRegistrosByUserId(userId: number) {
  return fetchAPI<Registro[]>(`/registro?usuario_id_usuario=${userId}`);
}

export async function getDocumentoDetalles() {
  return fetchAPI<DocumentoDetalle[]>('/documento-detalle');
}

export async function getDocumentoDetallesByRegistroId(registroId: number) {
  return fetchAPI<DocumentoDetalle[]>(`/documento-detalle?registro_id_registro=${registroId}`);
}

export interface Carrera {
  id_carrera: number;
  nombre_carrera: string;
}

export interface NivelNombramiento {
  id_niveles: number;
  nivel: string;
}

export interface Nombramiento {
  idnombramiento: number;
  titulo: string;
  niveles_id_niveles: number;
  niveles_id_niveles_rel?: NivelNombramiento;
}

export async function getAllCarreras() {
  return fetchAPI<{
    status: string;
    data: Carrera[];
  }>('/Carrera/getAll');
}

export async function getAllNombramientos() {
  return fetchAPI<{
    status: string;
    data: Nombramiento[];
  }>('/Nombramiento/getAll');
}

export async function createUser(data: {
  nombre: string;
  ap_pat: string;
  ap_mat?: string;
  correo: string;
  fecha_nacimiento: string;
  fecha_contratacion: string;
  roles_id_role: number;
  carrera_id_carrera: number;
  nombramiento_idnombramiento: number;
}) {
  return fetchAPI<{
    status: string;
    message: string;
    user: Usuario;
  }>('/User/insertUser', {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      activo: true
    }),
  });
}
