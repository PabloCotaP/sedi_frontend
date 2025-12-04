const API_BASE_URL = 'http://localhost:8000/api';

const vistaLista = document.getElementById('vista-lista');
const vistaFormulario = document.getElementById('vista-formulario');
const btnAgregar = document.getElementById('btn-agregar');
const btnRegresar = document.getElementById('btn-regresar');
const form = document.getElementById('info-form');

let currentUserId = null;

function getAccessToken() {
  return localStorage.getItem('access_token');
}

function safeGet(id) {
  return document.getElementById(id) || { value: '' };
}

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseDate(dateString) {
  if (!dateString) return '';
  const parts = dateString.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateString;
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

async function loadUserData() {
  try {
    const sessionData = await fetchAPI('/user');
    if (sessionData.status === 'success' && sessionData.user) {
      currentUserId = sessionData.user.id;
      const userData = await fetchAPI('/User/get');
      if (userData.status === 'success' && userData.user) {
        const user = userData.user;
        document.getElementById('show_fullName').value = user.nombre || '';
        document.getElementById('show_apellidoP').value = user.ap_pat || '';
        document.getElementById('show_apellidoM').value = user.ap_mat || '';
        document.getElementById('show_birthDate').value = formatDate(user.fecha_nacimiento);
        document.getElementById('show_fechaContratacion').value = formatDate(user.fecha_contratacion);
        document.getElementById('show_nombramiento').value = '';
        document.getElementById('show_cedula').value = '';
      }
    }
  } catch (error) {
    window.location.href = '/';
  }
}

function updateListaFromUser(user) {
  document.getElementById('show_fullName').value = user.nombre || '';
  document.getElementById('show_apellidoP').value = user.ap_pat || '';
  document.getElementById('show_apellidoM').value = user.ap_mat || '';
  document.getElementById('show_birthDate').value = formatDate(user.fecha_nacimiento);
  document.getElementById('show_fechaContratacion').value = formatDate(user.fecha_contratacion);
}

if (btnAgregar && vistaLista && vistaFormulario) {
  btnAgregar.addEventListener('click', () => {
    safeGet('fullName').value = document.getElementById('show_fullName').value || '';
    safeGet('apellidoP').value = document.getElementById('show_apellidoP').value || '';
    safeGet('apellidoM').value = document.getElementById('show_apellidoM').value || '';
    safeGet('birthDate').value = document.getElementById('show_birthDate').value || '';
    safeGet('nombramiento').value = document.getElementById('show_nombramiento').value || '';
    safeGet('fechaContratacion').value = document.getElementById('show_fechaContratacion').value || '';
    safeGet('cedula').value = document.getElementById('show_cedula').value || '';
    vistaLista.classList.add('hidden');
    vistaFormulario.classList.remove('hidden');
  });
}

if (btnRegresar && vistaLista && vistaFormulario) {
  btnRegresar.addEventListener('click', () => {
    vistaFormulario.classList.add('hidden');
    vistaLista.classList.remove('hidden');
  });
}

if (form && vistaLista && vistaFormulario) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      alert('Error: No se pudo identificar al usuario.');
      return;
    }
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Guardando...';
    submitBtn.disabled = true;
    try {
      const updateData = {
        nombre: safeGet('fullName').value,
        ap_pat: safeGet('apellidoP').value,
        ap_mat: safeGet('apellidoM').value,
        fecha_nacimiento: parseDate(safeGet('birthDate').value),
        fecha_contratacion: parseDate(safeGet('fechaContratacion').value),
      };
      const response = await fetchAPI(`/User/updateUser/${currentUserId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      if (response.status === 'success') {
        document.getElementById('show_fullName').value = safeGet('fullName').value;
        document.getElementById('show_apellidoP').value = safeGet('apellidoP').value;
        document.getElementById('show_apellidoM').value = safeGet('apellidoM').value;
        document.getElementById('show_birthDate').value = safeGet('birthDate').value;
        document.getElementById('show_fechaContratacion').value = safeGet('fechaContratacion').value;
        alert('Datos actualizados correctamente.');
        vistaFormulario.classList.add('hidden');
        vistaLista.classList.remove('hidden');
      } else {
        alert('Error al actualizar: ' + (response.message || 'Error desconocido'));
      }
    } catch (error) {
      alert('Error al actualizar los datos: ' + error.message);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

loadUserData();

