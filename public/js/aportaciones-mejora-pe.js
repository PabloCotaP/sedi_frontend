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

(async function setupAportaciones(){
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

  const tabla = document.getElementById('tabla-aportaciones');
  if (!tabla) return;

  const vistaLista = document.getElementById('vista-lista');
  const vistaFormulario = document.getElementById('vista-formulario');
  const btnAgregar = document.getElementById('btn-agregar');
  const btnRegresar = document.getElementById('btn-regresar');
  const formulario = document.querySelector('#vista-formulario form');
  const textarea = document.getElementById('descripcion');
  const charCount = document.getElementById('char-count');
  const wordCount = document.getElementById('word-count');

  let aportaciones = [];
  let editandoIndex = null;

  function contarPalabras(texto){
    return texto.trim().split(/\s+/).filter(w=>w.length>0).length;
  }

  textarea && textarea.addEventListener('input', ()=>{
    const texto = textarea.value;
    const palabras = contarPalabras(texto);
    const caracteres = texto.length;
    if (wordCount) wordCount.textContent = String(palabras);
    if (charCount) charCount.textContent = String(caracteres);
    if (palabras > 200) wordCount && wordCount.classList.add('text-red-600','font-bold');
    else wordCount && wordCount.classList.remove('text-red-600','font-bold');
  });

  function renderizarTabla(){
    if (!tabla) return;
    if (aportaciones.length === 0) {
      tabla.innerHTML = `
        <tr>
          <td colspan="2" class="border border-gray-400 px-4 py-8 text-center text-gray-500">
            No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.
          </td>
        </tr>
      `;
      return;
    }

    tabla.innerHTML = aportaciones.map((item,index)=>{
      const desc = (item.descripcion||'').toString();
      const short = desc.length>150?desc.substring(0,150)+"...":desc;
      return `
        <tr class="hover:bg-gray-50">
          <td class="border border-gray-400 px-4 py-3 text-black">${short}</td>
          <td class="border border-gray-400 px-4 py-3">
            <div class="flex justify-center items-center gap-3">
              <button class="btn-editar bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm" data-index="${index}" title="Editar">Editar</button>
              <button class="btn-eliminar bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm" data-index="${index}" title="Eliminar">Eliminar</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    document.querySelectorAll('#tabla-aportaciones .btn-editar').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const idx = parseInt(btn.getAttribute('data-index')||'0',10);
        editandoIndex = idx;
        const it = aportaciones[idx]||{};
        if (textarea) textarea.value = it.descripcion || '';
        if (wordCount) wordCount.textContent = String(contarPalabras(it.descripcion||''));
        if (charCount) charCount.textContent = String((it.descripcion||'').length);
        vistaLista?.classList.add('hidden');
        vistaFormulario?.classList.remove('hidden');
      });
    });

    document.querySelectorAll('#tabla-aportaciones .btn-eliminar').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
        const idx = parseInt(btn.getAttribute('data-index')||'0',10);
        aportaciones.splice(idx,1);
        localStorage.setItem('aportaciones_mejora', JSON.stringify(aportaciones));
        renderizarTabla();
      });
    });
  }

  btnAgregar?.addEventListener('click', ()=>{
    editandoIndex = null;
    formulario && (formulario.reset(), false);
    if (wordCount) wordCount.textContent = '0';
    if (charCount) charCount.textContent = '0';
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
    const descripcion = formData.get('descripcion') || '';
    const palabras = contarPalabras(descripcion.toString());
    if (palabras > 200) {
      if (!confirm(`Tu descripción tiene ${palabras} palabras, que excede el límite de 200 palabras. ¿Deseas guardar de todos modos?`)) return;
    }
    const aport = { descripcion: descripcion, documento: formData.get('documento') || null };
    if (editandoIndex !== null) { aportaciones[editandoIndex] = aport; editandoIndex = null; }
    else { aportaciones.push(aport); }
    localStorage.setItem('aportaciones_mejora', JSON.stringify(aportaciones));
    renderizarTabla();
    vistaFormulario?.classList.add('hidden');
    vistaLista?.classList.remove('hidden');
    formulario && formulario.reset();
  });

  const stored = localStorage.getItem('aportaciones_mejora');
  if (stored) {
    try {
      aportaciones = JSON.parse(stored);
    } catch(e) {
      aportaciones = [];
    }
  }
  renderizarTabla();
})();