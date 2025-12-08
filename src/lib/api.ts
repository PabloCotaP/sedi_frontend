export const API_BASE_URL = 'http://sedi_backend.test/api';

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
  usuarios_id_usuario: number;
  tipo_documento_idtipo_documento: number;
  descripcion: string;
  fecha_creacion: string;
}

export interface TipoDocumento {
  idtipo_documento: number;
  tipo_documento: string;
}

export interface DocumentoDetalle {
  iddocumento_detalle: number;
  documento_idDocumento: number;
  tipo_documento_idtipo_documento: number;
  institucion_idinstitucion: number | null;
  ruta_archivo: string;
  descripcion_doc: string;
  fecha_subida: string;
  estado_documento: string;
  tipo_documento_idtipo_documento_rel?: TipoDocumento;
  institucion_idinstitucion_rel?: Institucion;
}

export async function getAllTiposDocumento() {
  return fetchAPI<{
    status: string;
    data: TipoDocumento[];
  }>('/TipoDocumento/getAll');
}

export async function getMyDocuments() {
  return fetchAPI<{
    status: string;
    data: DocumentoDetalle[];
  }>('/Documento/getMy');
}

export async function getUserDocuments(userId: number) {
  return fetchAPI<{
    status: string;
    data: DocumentoDetalle[];
  }>(`/Documento/getUser/${userId}`);
}

export async function uploadDocument(formData: FormData) {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}/Documento/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}`);
  }

  return response.json();
}

export async function deleteDocument(id: number) {
  return fetchAPI<{
    status: string;
    message: string;
  }>(`/Documento/delete/${id}`, {
    method: 'DELETE',
  });
}

export function getDocumentDownloadUrl(id: number): string {
  return `${API_BASE_URL}/Documento/download/${id}`;
}

// === EXPEDIENTE (Módulos con documentos) ===

export interface ExpedienteInfoExtra {
  idinfo_extra?: number;
  anio_obtencion?: number;
  horas?: number;
  nivel_experiencia?: string;
  fecha_inicio?: string;
  fecha_final?: string;
  puesto?: string;
  pais_idpais?: number;
}

export interface ExpedienteDocumento {
  iddocumento_detalle: number;
  ruta_archivo: string;
  descripcion_doc: string;
  fecha_subida: string;
  estado_documento: string;
  institucion_idinstitucion?: number;
  valido?: boolean;
  motivo_invalidez?: string;
}

export interface ExpedienteRegistro {
  id_registro: number;
  descripcion: string;
  fecha_creacion: string;
  documento?: ExpedienteDocumento;
  info_extra?: ExpedienteInfoExtra;
}

export type ModuloExpediente = 
  | 'capacitacion-docente'
  | 'actualizacion-disciplinar'
  | 'gestion-academica'
  | 'productos-academicos'
  | 'exp-prof-no-academica'
  | 'exp-diseno-ingenieril'
  | 'logros-prof-no-academicos'
  | 'participacion-colegios'
  | 'premios-distinciones'
  | 'aportaciones-mejora-pe'
  | 'formacion-academica';

export async function getExpedienteByModulo(modulo: ModuloExpediente) {
  return fetchAPI<{
    status: string;
    data: ExpedienteRegistro[];
  }>(`/Expediente/${modulo}`);
}

export async function getExpedienteByModuloAndUser(modulo: ModuloExpediente, userId: number) {
  return fetchAPI<{
    status: string;
    data: ExpedienteRegistro[];
  }>(`/Expediente/${modulo}/user/${userId}`);
}

export async function createExpediente(modulo: ModuloExpediente, formData: FormData) {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}/Expediente/${modulo}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}`);
  }

  return response.json();
}

export async function updateExpediente(modulo: ModuloExpediente, id: number, formData: FormData) {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`${API_BASE_URL}/Expediente/${modulo}/update/${id}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}`);
  }

  return response.json();
}

export async function deleteExpediente(modulo: ModuloExpediente, id: number) {
  return fetchAPI<{
    status: string;
    message: string;
  }>(`/Expediente/${modulo}/${id}`, {
    method: 'DELETE',
  });
}

export function getExpedienteDownloadUrl(id: number): string {
  const token = getAccessToken();
  return `${API_BASE_URL}/Expediente/download/${id}?token=${encodeURIComponent(token || '')}`;
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

export async function createInstitucion(nombre: string) {
  return fetchAPI<{
    status: string;
    message: string;
    data: Institucion;
  }>('/Institucion/insert', {
    method: 'POST',
    body: JSON.stringify({ nombre }),
  });
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

export interface DocumentoInvalido {
  iddocumento_detalle: number;
  descripcion: string;
  tipo_documento: string;
  motivo_invalidez: string;
  fecha_invalidacion: string;
  ruta_archivo: string;
}

export async function marcarDocumentoInvalido(documentoId: number, motivo: string) {
  return fetchAPI<{
    status: string;
    message: string;
  }>(`/Documento/marcar-invalido/${documentoId}`, {
    method: 'POST',
    body: JSON.stringify({ motivo }),
  });
}

export async function getDocumentosInvalidos() {
  return fetchAPI<{
    status: string;
    data: DocumentoInvalido[];
    total: number;
  }>('/Documento/invalidos');
}

export async function restaurarDocumentoValido(documentoId: number) {
  return fetchAPI<{
    status: string;
    message: string;
  }>(`/Documento/restaurar-valido/${documentoId}`, {
    method: 'POST',
  });
}
