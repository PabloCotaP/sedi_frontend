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

(function(){
  const headerEmailElement = document.querySelector('header p.text-sm.opacity-90');
  
  async function checkAuth() {
    try {
      const session = await fetchAPI('/user');
      if (session.status === 'success' && session.user) {
        if (headerEmailElement) {
          headerEmailElement.textContent = session.user.correo;
        }
        return true;
      }
    } catch (error) {
      window.location.href = '/';
      return false;
    }
    window.location.href = '/';
    return false;
  }

  (async function setupFormacion(){
    const tabla = document.getElementById('tabla-formacion');
    if (!tabla) return;

    const isAuth = await checkAuth();
    if (!isAuth) return;

    const vistaLista = document.getElementById('vista-lista');
    const vistaFormulario = document.getElementById('vista-formulario');
    const btnAgregar = document.getElementById('btn-agregar');
    const btnRegresar = document.getElementById('btn-regresar');
    const formulario = document.querySelector('#vista-formulario form');
    const nivelSelect = document.getElementById('nivel-select');
    const institucionInput = document.getElementById('institucion-input');
    const paisInput = document.getElementById('pais-input');

    let formaciones = [];
    let paises = [];
    let instituciones = [];
    let editandoId = null;

    async function cargarDatosIniciales() {
      try {
        const [paisesRes, institucionesRes, formacionesRes] = await Promise.all([
          fetchAPI('/Pais/getAll'),
          fetchAPI('/Institucion/getAll'),
          fetchAPI('/Formacion/getMy')
        ]);
        
        if (paisesRes.status === 'success') {
          paises = paisesRes.data || [];
          if (paisInput) {
            paisInput.innerHTML = '<option value="">Selecciona un país</option>';
            paises.forEach(p => {
              paisInput.innerHTML += `<option value="${p.idpais}">${p.pais}</option>`;
            });
          }
        }
        
        if (institucionesRes.status === 'success') {
          instituciones = institucionesRes.data || [];
          if (institucionInput) {
            institucionInput.innerHTML = '<option value="">Selecciona una institución</option>';
            instituciones.forEach(i => {
              institucionInput.innerHTML += `<option value="${i.idinstitucion}">${i.nombre}</option>`;
            });
          }
        }
        
        if (formacionesRes.status === 'success') {
          formaciones = formacionesRes.data || [];
        }
        
        renderizarTabla();
      } catch (error) {
        alert('Error al cargar los datos. Por favor recarga la página.');
      }
    }

    function getNivelTexto(nivelId) {
      const niveles = {
        1: 'Licenciatura',
        2: 'Maestría',
        3: 'Doctorado',
        4: 'Especialidad'
      };
      return niveles[nivelId] || 'N/A';
    }

    function getPaisNombre(paisId) {
      const pais = paises.find(p => p.idpais === paisId);
      return pais ? pais.pais : 'N/A';
    }

    function getInstitucionNombre(instId) {
      const inst = instituciones.find(i => i.idinstitucion === instId);
      return inst ? inst.nombre : 'N/A';
    }

    function renderizarTabla() {
      if (!tabla) return;
      if (formaciones.length === 0) {
        tabla.innerHTML = `
          <tr>
            <td colspan="7" class="border border-gray-300 px-4 py-8 text-center text-gray-500">
              No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.
            </td>
          </tr>
        `;
        return;
      }

      tabla.innerHTML = formaciones.map((item) => `
        <tr class="hover:bg-gray-50">
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${getNivelTexto(item.niveles_id_niveles)}</td>
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.formacion || ''}</td>
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${getInstitucionNombre(item.institucion_idinstitucion)}</td>
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${getPaisNombre(item.pais_idpais)}</td>
          <td class="border border-gray-300 px-4 py-3 text-center text-gray-700">${item.anio_obtencion || ''}</td>
          <td class="border border-gray-300 px-4 py-3 text-center text-gray-700">${item.cedula || 'N/A'}</td>
          <td class="border border-gray-300 px-4 py-3 text-center">
            <div class="flex justify-center items-center gap-3">
              <button class="btn-editar bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-sm" data-id="${item.id_formacion}" title="Editar">Editar</button>
              <button class="btn-eliminar bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm" data-id="${item.id_formacion}" title="Eliminar">Eliminar</button>
            </div>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('#tabla-formacion .btn-editar').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.getAttribute('data-id'), 10);
          const item = formaciones.find(f => f.id_formacion === id);
          if (item) {
            editandoId = id;
            cargarEnFormulario(item);
            vistaLista?.classList.add('hidden');
            vistaFormulario?.classList.remove('hidden');
          }
        });
      });

      document.querySelectorAll('#tabla-formacion .btn-eliminar').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
          const id = parseInt(btn.getAttribute('data-id'), 10);
          try {
            const response = await fetchAPI(`/Formacion/delete/${id}`, { method: 'DELETE' });
            if (response.status === 'success') {
              formaciones = formaciones.filter(f => f.id_formacion !== id);
              renderizarTabla();
              alert('Registro eliminado correctamente.');
            }
          } catch (error) {
            alert('Error al eliminar: ' + error.message);
          }
        });
      });
    }

    function cargarEnFormulario(item) {
      if (nivelSelect) {
        const nivelMap = { 1: 'Licenciatura', 2: 'Maestría', 3: 'Doctorado', 4: 'Especialidad' };
        nivelSelect.value = nivelMap[item.niveles_id_niveles] || '';
      }
      const nombreEl = document.getElementById('nombre-input');
      if (nombreEl) nombreEl.value = item.formacion || '';
      if (institucionInput) institucionInput.value = item.institucion_idinstitucion || '';
      if (paisInput) paisInput.value = item.pais_idpais || '';
      const anioEl = document.getElementById('anio-input');
      if (anioEl) anioEl.value = item.anio_obtencion || '';
      const cedulaEl = document.getElementById('cedula-input');
      if (cedulaEl) cedulaEl.value = item.cedula || '';
    }

    function resetearFormulario() {
      if (nivelSelect) nivelSelect.value = '';
      const nombreEl = document.getElementById('nombre-input');
      if (nombreEl) nombreEl.value = '';
      if (institucionInput) institucionInput.value = '';
      if (paisInput) paisInput.value = '';
      const anioEl = document.getElementById('anio-input');
      if (anioEl) anioEl.value = '';
      const cedulaEl = document.getElementById('cedula-input');
      if (cedulaEl) cedulaEl.value = '';
      editandoId = null;
    }

    btnAgregar?.addEventListener('click', () => {
      editandoId = null;
      formulario && formulario.reset();
      resetearFormulario();
      vistaLista?.classList.add('hidden');
      vistaFormulario?.classList.remove('hidden');
    });

    btnRegresar?.addEventListener('click', () => {
      editandoId = null;
      vistaFormulario?.classList.add('hidden');
      vistaLista?.classList.remove('hidden');
      formulario && formulario.reset();
      resetearFormulario();
    });

    formulario?.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nivelTexto = nivelSelect ? nivelSelect.value : '';
      const nivelMap = { 'Licenciatura': 1, 'Maestría': 2, 'Doctorado': 3, 'Especialidad': 4 };
      const niveles_id_niveles = nivelMap[nivelTexto];

      const nombreEl = document.getElementById('nombre-input');
      const anioEl = document.getElementById('anio-input');
      const cedulaEl = document.getElementById('cedula-input');

      const formacion = nombreEl ? nombreEl.value.trim() : '';
      const anio_obtencion = anioEl ? parseInt(anioEl.value, 10) : 0;
      const cedula = cedulaEl ? cedulaEl.value.trim() : '';
      const pais_idpais = paisInput ? parseInt(paisInput.value, 10) : 0;
      const institucion_idinstitucion = institucionInput ? parseInt(institucionInput.value, 10) : 0;

      if (!niveles_id_niveles || !formacion || !pais_idpais || !institucion_idinstitucion || !anio_obtencion) {
        alert('Por favor completa todos los campos requeridos.');
        return;
      }

      const submitBtn = formulario.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Guardar';
      if (submitBtn) {
        submitBtn.textContent = 'Guardando...';
        submitBtn.disabled = true;
      }

      try {
        const data = {
          niveles_id_niveles,
          formacion,
          anio_obtencion,
          cedula: cedula || null,
          pais_idpais,
          institucion_idinstitucion
        };

        let response;
        if (editandoId !== null) {
          response = await fetchAPI(`/Formacion/update/${editandoId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
          });
          if (response.status === 'success') {
            const index = formaciones.findIndex(f => f.id_formacion === editandoId);
            if (index !== -1) {
              formaciones[index] = { ...formaciones[index], ...data };
            }
            alert('Formación actualizada correctamente.');
          }
        } else {
          response = await fetchAPI('/Formacion/insert', {
            method: 'POST',
            body: JSON.stringify(data)
          });
          if (response.status === 'success' && response.data) {
            formaciones.push(response.data);
            alert('Formación registrada correctamente.');
          }
        }

        renderizarTabla();
        vistaFormulario?.classList.add('hidden');
        vistaLista?.classList.remove('hidden');
        formulario && formulario.reset();
        resetearFormulario();

      } catch (error) {
        alert('Error al guardar: ' + error.message);
      } finally {
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }
    });

    await cargarDatosIniciales();
  })();

})();