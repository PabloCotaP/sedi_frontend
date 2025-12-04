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
  const headerEmailElement = document.querySelector('header p.text-sm.opacity-90');
  
  try {
    const session = await fetchAPI('/user');
    if (session.status !== 'success' || !session.user) {
      window.location.href = '/';
      return;
    }
    if (headerEmailElement) headerEmailElement.textContent = session.user.correo;
  } catch (error) {
    window.location.href = '/';
    return;
  }

  (function setupCapacitacion(){
    const tabla = document.getElementById('tabla-capacitacion');
    if (!tabla) return;

    const vistaLista = document.getElementById('vista-lista');
    const vistaFormulario = document.getElementById('vista-formulario');
    const btnAgregar = document.getElementById('btn-agregar');
    const btnRegresar = document.getElementById('btn-regresar');
    const formulario = document.querySelector('#vista-formulario form');
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const fileNameDisplay = document.getElementById('file-name');

    let capacitaciones = [];
    let editandoIndex = null;

    function renderizarTabla() {
      if (!tabla) return;
      if (capacitaciones.length === 0) {
        tabla.innerHTML = `
          <tr>
            <td colspan="6" class="border border-gray-300 px-4 py-8 text-center text-gray-500">
              No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.
            </td>
          </tr>
        `;
        return;
      }

      tabla.innerHTML = capacitaciones.map((item, index) => `
        <tr class="hover:bg-gray-50">
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.tipo || ''}</td>
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.institucion || ''}</td>
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.pais || ''}</td>
          <td class="border border-gray-300 px-4 py-3 text-center text-gray-700">${item.anio || ''}</td>
          <td class="border border-gray-300 px-4 py-3 text-center text-gray-700">${item.horas || ''}</td>
          <td class="border border-gray-300 px-4 py-3 text-center">
            <div class="flex justify-center items-center gap-3">
              <button class="btn-editar bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm" data-index="${index}" title="Editar">Editar</button>
              <button class="btn-eliminar bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm" data-index="${index}" title="Eliminar">Eliminar</button>
            </div>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('#tabla-capacitacion .btn-editar').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
          editandoIndex = idx;
          const it = capacitaciones[idx] || {};
          cargarEnFormulario(it, idx);
          vistaLista?.classList.add('hidden');
          vistaFormulario?.classList.remove('hidden');
        });
      });

      document.querySelectorAll('#tabla-capacitacion .btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
          const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
          capacitaciones.splice(idx, 1);
          localStorage.setItem('capacitaciones', JSON.stringify(capacitaciones));
          renderizarTabla();
        });
      });
    }

    function cargarEnFormulario(item, index) {
      const tipoEl = document.getElementById('tipo-capacitacion');
      const institucionEl = document.getElementById('institucion-input');
      const paisEl = document.getElementById('pais-input');
      const anioEl = document.getElementById('anio-input');
      const horasEl = document.getElementById('horas-input');

      if (tipoEl) tipoEl.value = item.tipo || '';
      if (institucionEl) institucionEl.value = item.institucion || '';
      if (paisEl) paisEl.value = item.pais || '';
      if (anioEl) anioEl.value = item.anio || '';
      if (horasEl) horasEl.value = item.horas || '';
      if (fileNameDisplay) fileNameDisplay.textContent = item.archivoNombre || 'Ningún archivo seleccionado';
      if (fileInput) fileInput.value = '';
      editandoIndex = index;
    }

    function resetearFormulario() {
      const tipoEl = document.getElementById('tipo-capacitacion');
      const institucionEl = document.getElementById('institucion-input');
      const paisEl = document.getElementById('pais-input');
      const anioEl = document.getElementById('anio-input');
      const horasEl = document.getElementById('horas-input');

      if (tipoEl) tipoEl.value = '';
      if (institucionEl) institucionEl.value = '';
      if (paisEl) paisEl.value = '';
      if (anioEl) anioEl.value = '';
      if (horasEl) horasEl.value = '';
      if (fileNameDisplay) fileNameDisplay.textContent = 'Ningún archivo seleccionado';
      if (fileInput) fileInput.value = '';
      editandoIndex = null;
    }

    btnAgregar?.addEventListener('click', () => {
      editandoIndex = null;
      formulario && formulario.reset();
      resetearFormulario();
      vistaLista?.classList.add('hidden');
      vistaFormulario?.classList.remove('hidden');
    });

    btnRegresar?.addEventListener('click', () => {
      editandoIndex = null;
      vistaFormulario?.classList.add('hidden');
      vistaLista?.classList.remove('hidden');
      formulario && formulario.reset();
      resetearFormulario();
    });

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => fileInput.click());
    }
    if (fileInput && fileNameDisplay) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        fileNameDisplay.textContent = file ? file.name : 'No hay archivo seleccionado';
      });
    }

    formulario?.addEventListener('submit', (e) => {
      e.preventDefault();

      const tipoEl = document.getElementById('tipo-capacitacion');
      const institucionEl = document.getElementById('institucion-input');
      const paisEl = document.getElementById('pais-input');
      const anioEl = document.getElementById('anio-input');
      const horasEl = document.getElementById('horas-input');

      const tipo = tipoEl ? (tipoEl.value || '').toString().trim() : '';
      const institucion = institucionEl ? (institucionEl.value || '').toString().trim() : '';
      const pais = paisEl ? (paisEl.value || '').toString().trim() : '';
      const anio = anioEl ? (anioEl.value || '').toString().trim() : '';
      const horas = horasEl ? (horasEl.value || '').toString().trim() : '';
      const file = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0] : null;
      const archivoNombre = file ? file.name : (capacitaciones[editandoIndex]?.archivoNombre || '');

      if (!tipo) {
        alert('Por favor completa el campo "Tipo de capacitación".');
        return;
      }

      const nuevaCapacitacion = { tipo, institucion, pais, anio, horas, archivoNombre };

      if (editandoIndex !== null && editandoIndex !== undefined) {
        capacitaciones[editandoIndex] = nuevaCapacitacion;
      } else {
        capacitaciones.push(nuevaCapacitacion);
      }

      localStorage.setItem('capacitaciones', JSON.stringify(capacitaciones));
      renderizarTabla();
      vistaFormulario?.classList.add('hidden');
      vistaLista?.classList.remove('hidden');
      formulario && formulario.reset();
      resetearFormulario();
    });

    const stored = localStorage.getItem('capacitaciones');
    if (stored) {
      try {
        capacitaciones = JSON.parse(stored);
      } catch(e) {
        capacitaciones = [];
      }
    }
    renderizarTabla();
  })();
})();