document.addEventListener('DOMContentLoaded', function() {
    const email = localStorage.getItem('user_email');
    if(!email) {
        window.location.href = '/';
        return;
    }
    const headerEmailElement = document.querySelector('header p.text-sm.opacity-90');
    if(headerEmailElement) {
        headerEmailElement.textContent = email;
    }
    const vistaLista = document.getElementById('vista-lista');
    const vistaFormulario = document.getElementById('vista-formulario');
    const btnAgregar = document.getElementById('btn-agregar');
    const btnRegresar = document.getElementById('btn-regresar');
    const tablaFormacion = document.getElementById('tabla-formacion');
    const guardarBtn = document.getElementById('guardar-btn');
    const fileInput = document.getElementById('file-input');
    const fileNameDisplay = document.getElementById('file-name');
    const uploadBtn = document.getElementById('upload-btn')

    let formaciones = [];

     function renderizarTabla() {
    if (!tablaFormacion) return;

    if (formaciones.length === 0) {
      tablaFormacion.innerHTML = `
        <tr>
          <td colspan="7" class="border border-gray-300 px-4 py-8 text-center text-gray-500">
            No hay registros aún. Haz clic en "Agregar" para crear uno nuevo.
          </td>
        </tr>
      `;
       } else {
      tablaFormacion.innerHTML = formaciones.map((item, index) => `
        <tr class="hover:bg-gray-50">
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.nivel}</td>
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.nombre}</td>
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.institucion}</td>
          <td class="border border-gray-300 px-4 py-3 text-gray-700">${item.pais}</td>
          <td class="border border-gray-300 px-4 py-3 text-center text-gray-700">${item.anio}</td>
          <td class="border border-gray-300 px-4 py-3 text-center text-gray-700">${item.cedula}</td>
          <td class="border border-gray-300 px-4 py-3 text-center">
            <div class="flex justify-center items-center gap-3">
                <button class="btn-ver text-gray-600 hover:text-gray-800" data-index="${index}" title="Ver">🔍</button>
                <button class="btn-editar text-gray-600 hover:text-gray-800" data-index="${index}" title="Editar">✏️</button>
                <button class="btn-eliminar text-red-600 hover:text-red-800" data-index="${index}" title="Eliminar">🗑️</button>
              </div>
          </td>
        </tr>
      `).join('');
    }

    document.querySelectorAll('.btn-editar').forEach(button => {
      button.addEventListener('click', (e) => {
        const index = parseInt(btn.getAttribute('data-index'), 10);
        const item = formaciones[index];
        cargarEnFormulario(item, index);
        vistaLista?.classList.add('hidden');
        vistaFormulario?.classList.remove('hidden');
        });
    });
    }

    function cargarEnFormulario(item,index) {
        document.getElementById('nivel-select').value = item.nivel;
        document.getElementById('nombre-input').value = item.nombre;
        document.getElementById('institucion-input').value = item.institucion;
        document.getElementById('pais-input').value = item.pais;
        document.getElementById('anio-input').value = item.anio;
        document.getElementById('cedula-input').value = item.cedula;
        if(fileNameDisplay) fileNameDisplay.textContent = item.archivoNombre || 'Ningún archivo seleccionado';
        cargarEnFormulario.editandoIndex = index;
    }

    function resetearFormulario() {
        document.getElementById('nivel-select').value = '';
        document.getElementById('nombre-input').value = '';
        document.getElementById('institucion-input').value = '';
        document.getElementById('pais-input').value = '';
        document.getElementById('anio-input').value = '';
        document.getElementById('cedula-input').value = '';
        if(fileNameDisplay) fileNameDisplay.textContent = 'Ningún archivo seleccionado';
        if(fileInput) fileInput.value = '';
        cargarEnFormulario.editandoIndex = null;
    }
    if(btnAgregar){
    btnAgregar.addEventListener('click', () => {
    vistaLista?.classList.add('hidden');
    vistaFormulario?.classList.remove('hidden');
  });
  }

  if(btnRegresar){
    btnRegresar.addEventListener('click', () => {
    vistaFormulario?.classList.add('hidden');
    vistaLista?.classList.remove('hidden');
    resetearFormulario();
  });
  }

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

  if (guardarBtn) {
    guardarBtn.addEventListener('click', () => {
      const nivel = document.getElementById('nivel-select').value;
      const nombre = document.getElementById('nombre-input').value.trim();
      const institucion = document.getElementById('institucion-input').value.trim();
      const pais = document.getElementById('pais-input').value.trim();
      const anio = document.getElementById('anio-input').value;
      const cedula = document.getElementById('cedula-input').value.trim();
      const fileName = fileNameDisplay?.textContent || '';

      if (!nivel || !nombre) {
        alert('Por favor completa los campos requeridos (Nivel y Nombre).');
        return;
      }

      const nuevaFormacion = {nivel,nombre,institucion,pais,anio,cedula,fileName };

      const editandoIndex = cargarEnFormulario.editandoIndex;
      if (editandoIndex !== undefined && editandoIndex !== null) {
        formaciones[editandoIndex] = nuevaFormacion;
      } else {
        formaciones.push(nuevaFormacion);
      }

        renderizarTabla();
        vistaFormulario?.classList.add('hidden');
        vistaLista?.classList.remove('hidden');
        resetearFormulario();
    });
  }
    renderizarTabla();
})();