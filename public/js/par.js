document.addEventListener('DOMContentLoaded', function() {
  const headerEmailElement = document.querySelector('header p.text-sm.opacity-90');
  const email = localStorage.getItem('user_email');
  if (!email && headerEmailElement) {
    window.location.href = '/';
    return;
  }
  if (headerEmailElement) headerEmailElement.textContent = email;

  (function setupPremios(){
    const tabla = document.getElementById('tabla-premios');
    if (!tabla) return;

    const vistaLista = document.getElementById('vista-lista');
    const vistaFormulario = document.getElementById('vista-formulario');
    const btnAgregar = document.getElementById('btn-agregar');
    const btnRegresar = document.getElementById('btn-regresar');
    const formulario = document.querySelector('#vista-formulario form');
    const descripcionEl = document.getElementById('descripcion');
    const documentoInput = document.getElementById('documento');
    const fileNameDisplay = document.getElementById('file-name');
    const uploadBtn = document.getElementById('upload-btn');

    let premios = [];
    let editandoIndex = null;

    function renderizarTabla() {
      if (!tabla) return;
      if (premios.length === 0) {
        tabla.innerHTML = `
          <tr>
            <td colspan="2" class="border border-gray-300 px-4 py-8 text-center text-gray-500">
              No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.
            </td>
          </tr>
        `;
        return;
      }

      tabla.innerHTML = premios.map((item, index) => `
        <tr class="hover:bg-gray-50">
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.descripcion || ''}</td>
          <td class="border border-gray-300 px-4 py-3 text-center">
            <div class="flex justify-center items-center gap-3">
              <button class="btn-ver text-gray-600 hover:text-gray-800" data-index="${index}" title="Ver">A</button>
              <button class="btn-editar text-gray-600 hover:text-gray-800" data-index="${index}" title="Editar">B</button>
              <button class="btn-eliminar text-red-600 hover:text-red-800" data-index="${index}" title="Eliminar">C</button>
            </div>
          </td>
        </tr>
      `).join('');

      // Ver
      document.querySelectorAll('#tabla-premios .btn-ver').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
          const it = premios[idx] || {};
          const archivo = it.documento ? `\nArchivo: ${it.documento}` : '';
          alert(`Descripción: ${it.descripcion || ''}${archivo}`);
        });
      });

      // Editar
      document.querySelectorAll('#tabla-premios .btn-editar').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
          editandoIndex = idx;
          const it = premios[idx] || {};
          cargarEnFormulario(it, idx);
          vistaLista?.classList.add('hidden');
          vistaFormulario?.classList.remove('hidden');
        });
      });

      // Eliminar
      document.querySelectorAll('#tabla-premios .btn-eliminar').forEach(btn => {
        btn.addEventListener('click', () => {
          if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
          const idx = parseInt(btn.getAttribute('data-index') || '0', 10);
          premios.splice(idx, 1);
          renderizarTabla();
        });
      });
    }

    function cargarEnFormulario(item, index) {
      if (descripcionEl) descripcionEl.value = item.descripcion || '';
      if (fileNameDisplay) fileNameDisplay.textContent = item.documento || 'No hay archivo seleccionado';
      if (documentoInput) documentoInput.value = '';
      editandoIndex = index;
    }

    function resetearFormulario() {
      if (descripcionEl) descripcionEl.value = '';
      if (fileNameDisplay) fileNameDisplay.textContent = 'No hay archivo seleccionado';
      if (documentoInput) documentoInput.value = '';
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
    if (uploadBtn && documentoInput) {
      uploadBtn.addEventListener('click', () => {
        documentoInput.click();
      });
    }

    if (documentoInput && fileNameDisplay) {
      documentoInput.addEventListener('change', (e) => {
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

      const descripcion = descripcionEl ? (descripcionEl.value || '').toString().trim() : '';
      const file = (documentoInput && documentoInput.files && documentoInput.files[0]) ? documentoInput.files[0] : null;
      const documentoNombre = file ? file.name : (premios[editandoIndex]?.documento || '');

      if (!descripcion) {
        alert('Por favor, ingresa una descripción.');
        return;
      }

      const nuevo = { descripcion, documento: documentoNombre };

      if (editandoIndex !== null && editandoIndex !== undefined) {
        premios[editandoIndex] = nuevo;
      } else {
        premios.push(nuevo);
      }

      renderizarTabla();
      vistaFormulario?.classList.add('hidden');
      vistaLista?.classList.remove('hidden');
      formulario && formulario.reset();
      resetearFormulario();
    });

    renderizarTabla();
  })();

});