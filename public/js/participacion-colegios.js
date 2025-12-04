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

(async function setupParticipacion(){
  try {
    const session = await fetchAPI('/user');
    if (session.status !== 'success' || !session.user) {
      window.location.href = '/';
      return;
    }
  } catch (error) {
    window.location.href = '/';
    return;
  }

  const tabla = document.getElementById('tabla-participaciones');
  if (!tabla) return;

  const vistaLista = document.getElementById('vista-lista');
  const vistaFormulario = document.getElementById('vista-formulario');
  const btnAgregar = document.getElementById('btn-agregar');
  const btnRegresar = document.getElementById('btn-regresar');
  const formulario = document.querySelector('#vista-formulario form');

  let participaciones = [];
  let editandoIndex = null;

  function renderizarTabla() {
    if (!tabla) return;
    if (participaciones.length === 0) {
      tabla.innerHTML = `
        <tr>
          <td colspan="4" class="border border-gray-400 px-4 py-8 text-center text-gray-500">
            No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.
          </td>
        </tr>
      `;
      return;
    }

    tabla.innerHTML = participaciones.map((item, index) => `
      <tr class="hover:bg-gray-50">
        <td class="border border-gray-400 px-4 py-3 text-black">${item.organismo}</td>
        <td class="border border-gray-400 px-4 py-3 text-black">${item.periodo}</td>
        <td class="border border-gray-400 px-4 py-3 text-black">${item.nivelParticipacion}</td>
        <td class="border border-gray-400 px-4 py-3">
          <div class="flex justify-center items-center gap-3">
            <button class="btn-editar bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm" data-index="${index}" title="Editar">Editar</button>
            <button class="btn-eliminar bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm" data-index="${index}" title="Eliminar">Eliminar</button>
          </div>
        </td>
      </tr>
    `).join('');

    document.querySelectorAll('#tabla-participaciones .btn-editar').forEach(btn => {
      btn.addEventListener('click', ()=>{
        const idx = parseInt(btn.getAttribute('data-index') || '0',10);
        editandoIndex = idx;
        const item = participaciones[idx];
        const inOrganismo = document.getElementById('organismo');
        const inPeriodo = document.getElementById('periodo');
        const inNivel = document.getElementById('nivel');
        if (inOrganismo) inOrganismo.value = item.organismo;
        if (inPeriodo) inPeriodo.value = item.periodo;
        if (inNivel) inNivel.value = item.nivelParticipacion;
        if (vistaLista) vistaLista.classList.add('hidden');
        if (vistaFormulario) vistaFormulario.classList.remove('hidden');
      });
    });

    document.querySelectorAll('#tabla-participaciones .btn-eliminar').forEach(btn => {
      btn.addEventListener('click', ()=>{
        if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
        const idx = parseInt(btn.getAttribute('data-index') || '0',10);
        participaciones.splice(idx,1);
        localStorage.setItem('participacion_colegios', JSON.stringify(participaciones));
        renderizarTabla();
      });
    });
  }

  btnAgregar?.addEventListener('click', ()=>{
    editandoIndex = null;
    formulario && (formulario.reset(), false);
    vistaLista?.classList.add('hidden');
    vistaFormulario?.classList.remove('hidden');
  });

  btnRegresar?.addEventListener('click', ()=>{
    editandoIndex = null;
    vistaFormulario?.classList.add('hidden');
    vistaLista?.classList.remove('hidden');
    formulario && formulario.reset();
  });

  formulario?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const participacion = {
      organismo: formData.get('organismo') || '',
      periodo: formData.get('periodo') || '',
      nivelParticipacion: formData.get('nivel') || '',
      documento: formData.get('documento') || null
    };

    if (editandoIndex !== null) {
      participaciones[editandoIndex] = participacion;
      editandoIndex = null;
    } else {
      participaciones.push(participacion);
    }

    localStorage.setItem('participacion_colegios', JSON.stringify(participaciones));
    renderizarTabla();
    vistaFormulario?.classList.add('hidden');
    vistaLista?.classList.remove('hidden');
    formulario && formulario.reset();
  });

  const stored = localStorage.getItem('participacion_colegios');
  if (stored) {
    try {
      participaciones = JSON.parse(stored);
    } catch(e) {
      participaciones = [];
    }
  }
  renderizarTabla();
})();