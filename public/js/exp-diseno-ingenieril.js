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

  const vistaLista = document.getElementById('vista-lista');
  const vistaFormulario = document.getElementById('vista-formulario');
  const btnAgregar = document.getElementById('btn-agregar');
  const btnRegresar = document.getElementById('btn-regresar');
  const tabla = document.getElementById('tabla-participaciones');
  const formulario = document.querySelector('#vista-formulario form');

  if (!tabla) return;

  let items = [];
  let editIndex = null;

  function escapeHtml(str){
    if (str == null) return '';
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }

  function renderTabla(){
    if (!tabla) return;
    if (items.length === 0) {
      tabla.innerHTML = `
        <tr>
          <td colspan="4" class="border border-gray-400 px-4 py-8 text-center text-gray-500">
            No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.
          </td>
        </tr>
      `;
      return;
    }

    tabla.innerHTML = items.map((it, idx) => `
      <tr class="hover:bg-gray-50">
        <td class="border border-gray-400 px-4 py-3 text-black">${escapeHtml(it.organismo)}</td>
        <td class="border border-gray-400 px-4 py-3 text-black">${escapeHtml(it.periodo)}</td>        
        <td class="border border-gray-400 px-4 py-3 text-black">${escapeHtml(it.nivel)}</td>       
        <td class="border border-gray-400 px-4 py-3 text-center">        
          <div class="flex justify-center items-center gap-3">          
            <button class="btn-editar bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm" data-index="${idx}" title="Editar">Editar</button>           
            <button class="btn-eliminar bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm" data-index="${idx}" title="Eliminar">Eliminar</button>         
          </div>
        </td>
      </tr>
    `).join('');

    tabla.querySelectorAll('.btn-editar').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const i = Number(btn.getAttribute('data-index'));
        editIndex = i;
        const it = items[i];
        const inOrganismo = document.getElementById('organismo');
        const inPeriodo = document.getElementById('periodo');
        const inNivel = document.getElementById('nivel');
        if (inOrganismo) inOrganismo.value = it.organismo || '';
        if (inPeriodo) inPeriodo.value = it.periodo || '';
        if (inNivel) inNivel.value = it.nivel || '';
        vistaLista?.classList.add('hidden');
        vistaFormulario?.classList.remove('hidden');
      });
    });

    tabla.querySelectorAll('.btn-eliminar').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
        const i = Number(btn.getAttribute('data-index'));
        items.splice(i,1);
        localStorage.setItem('exp_diseno_ingenieril', JSON.stringify(items));
        renderTabla();
      });
    });
  }

  btnAgregar?.addEventListener('click', ()=>{
    editIndex = null;
    formulario && formulario.reset();
    vistaLista?.classList.add('hidden');
    vistaFormulario?.classList.remove('hidden');
  });

  btnRegresar?.addEventListener('click', ()=>{
    editIndex = null;
    vistaFormulario?.classList.add('hidden');
    vistaLista?.classList.remove('hidden');
    formulario && formulario.reset();
  });

  formulario?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const obj = {
      organismo: String(fd.get('organismo')||''),
      periodo: String(fd.get('periodo')||''),
      nivel: String(fd.get('nivel')||''),
      documento: fd.get('documento') ? (fd.get('documento').name || null) : null
    };
    if (editIndex !== null) {
      items[editIndex] = obj;
      editIndex = null;
    } else {
      items.push(obj);
    }
    localStorage.setItem('exp_diseno_ingenieril', JSON.stringify(items));
    renderTabla();
    vistaFormulario?.classList.add('hidden');
    vistaLista?.classList.remove('hidden');
    formulario && formulario.reset();
  });

  const stored = localStorage.getItem('exp_diseno_ingenieril');
  if (stored) {
    try {
      items = JSON.parse(stored);
    } catch(e) {
      items = [];
    }
  }
  renderTabla();
})();
