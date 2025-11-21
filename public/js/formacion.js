(function(){
  const headerEmailElement = document.querySelector('header p.text-sm.opacity-90');
  const email = localStorage.getItem('user_email');
  if (!email && headerEmailElement) {
    window.location.href = '/';
    return;
  }
  if (headerEmailElement) {
    headerEmailElement.textContent = email;
  }

  (function setupFormacion(){
    const tabla = document.getElementById('tabla-formacion');
    if (!tabla) return;

    const vistaLista = document.getElementById('vista-lista');
    const vistaFormulario = document.getElementById('vista-formulario');
    const btnAgregar = document.getElementById('btn-agregar');
    const btnRegresar = document.getElementById('btn-regresar');
    const formulario = document.querySelector('#vista-formulario form');
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const fileNameDisplay = document.getElementById('file-name');

    let formaciones = [];
    let editandoIndex = null;

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

      tabla.innerHTML = formaciones.map((item, index) => `
        <tr class="hover:bg-gray-50">
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.nivel || ''}</td>
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.nombre || ''}</td>
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.institucion || ''}</td>
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.pais || ''}</td>
          <td class="border border-gray-300 px-4 py-3 text-center text-gray-700">${item.anio || ''}</td>
          <td class="border border-gray-300 px-4 py-3 text-center text-gray-700">${item.cedula || ''}</td>
          <td class="border border-gray-300 px-4 py-3 text-center">
            <div class="flex justify-center items-center gap-3">
              <button class="btn-ver text-gray-600 hover:text-gray-800" data-index="${index}" title="Ver">🔍</button>
              <button class="btn-editar text-gray-600 hover:text-gray-800" data-index="${index}" title="Editar">✏️</button>
              <button class="btn-eliminar text-red-600 hover:text-red-800" data-index="${index}" title="Eliminar">🗑️</button>
            </div>
          </td>
        </tr>
      `).join('');

      document.querySelectorAll('#tabla-formacion .btn-ver').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
          const it = formaciones[idx] || {};
          const archivo = it.archivoNombre ? `\nArchivo: ${it.archivoNombre}` : '';
          alert(
            `Nivel: ${it.nivel || ''}\n` +
            `Nombre: ${it.nombre || ''}\n` +
            `Institución: ${it.institucion || ''}\n` +
            `País: ${it.pais || ''}\n` +
            `Año: ${it.anio || ''}\n` +
            `Cédula: ${it.cedula || ''}` +
            archivo
          );
        });
      });

      document.querySelectorAll('#tabla-formacion .btn-editar').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
          editandoIndex = idx;
          const it = formaciones[idx] || {};
          cargarEnFormulario(it, idx);
          vistaLista?.classList.add('hidden');
          vistaFormulario?.classList.remove('hidden');
        });
      });

      document.querySelectorAll('#tabla-formacion .btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
          const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
          formaciones.splice(idx, 1);
          renderizarTabla();
        });
      });
    }

    function cargarEnFormulario(item, index) {
      const nivelEl = document.getElementById('nivel-select');
      const nombreEl = document.getElementById('nombre-input');
      const institucionEl = document.getElementById('institucion-input');
      const paisEl = document.getElementById('pais-input');
      const anioEl = document.getElementById('anio-input');
      const cedulaEl = document.getElementById('cedula-input');

      if (nivelEl) nivelEl.value = item.nivel || '';
      if (nombreEl) nombreEl.value = item.nombre || '';
      if (institucionEl) institucionEl.value = item.institucion || '';
      if (paisEl) paisEl.value = item.pais || '';
      if (anioEl) anioEl.value = item.anio || '';
      if (cedulaEl) cedulaEl.value = item.cedula || '';
      if (fileNameDisplay) fileNameDisplay.textContent = item.archivoNombre || 'Ningún archivo seleccionado';
      if (fileInput) fileInput.value = ''; 
      editandoIndex = index;
    }

    function resetearFormulario() {
      const nivelEl = document.getElementById('nivel-select');
      const nombreEl = document.getElementById('nombre-input');
      const institucionEl = document.getElementById('institucion-input');
      const paisEl = document.getElementById('pais-input');
      const anioEl = document.getElementById('anio-input');
      const cedulaEl = document.getElementById('cedula-input');

      if (nivelEl) nivelEl.value = '';
      if (nombreEl) nombreEl.value = '';
      if (institucionEl) institucionEl.value = '';
      if (paisEl) paisEl.value = '';
      if (anioEl) anioEl.value = '';
      if (cedulaEl) cedulaEl.value = '';
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

    // Upload file UI
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', () => {
        fileInput.click();
      });
    }

    if (fileInput && fileNameDisplay) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          fileNameDisplay.textContent = file.name;
        } else {
          fileNameDisplay.textContent = 'No hay archivo seleccionado';
        }
      });
    }

    formulario?.addEventListener('submit', (e) => {
      e.preventDefault();

      const nivelEl = document.getElementById('nivel-select');
      const nombreEl = document.getElementById('nombre-input');
      const institucionEl = document.getElementById('institucion-input');
      const paisEl = document.getElementById('pais-input');
      const anioEl = document.getElementById('anio-input');
      const cedulaEl = document.getElementById('cedula-input');

      const nivel = nivelEl ? (nivelEl.value || '').toString().trim() : '';
      const nombre = nombreEl ? (nombreEl.value || '').toString().trim() : '';
      const institucion = institucionEl ? (institucionEl.value || '').toString().trim() : '';
      const pais = paisEl ? (paisEl.value || '').toString().trim() : '';
      const anio = anioEl ? (anioEl.value || '').toString().trim() : '';
      const cedula = cedulaEl ? (cedulaEl.value || '').toString().trim() : '';
      const file = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0] : null;
      const archivoNombre = file ? file.name : (formaciones[editandoIndex]?.archivoNombre || '');

      if (!nivel || !nombre) {
        alert('Por favor completa los campos requeridos (Nivel y Nombre).');
        return;
      }

      const nuevaFormacion = { nivel, nombre, institucion, pais, anio, cedula, archivoNombre };

      if (editandoIndex !== null && editandoIndex !== undefined) {
        formaciones[editandoIndex] = nuevaFormacion;
      } else {
        formaciones.push(nuevaFormacion);
      }

      renderizarTabla();
      vistaFormulario?.classList.add('hidden');
      vistaLista?.classList.remove('hidden');
      formulario && formulario.reset();
      resetearFormulario();
    });

    renderizarTabla();
  })();

})();